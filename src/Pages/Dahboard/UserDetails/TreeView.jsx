import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import apiClient from "../../../api/apiClient";
import "./UserDetails.css";

/**
 * TREE COMPONENT - Network tree visualization with expand/collapse
 * Data comes from API, not hardcoded
 */
const TreeComponent = () => {
  // ==================== STATE MANAGEMENT ====================
  const [treeData, setTreeData] = useState(null);        // Complete tree structure from API
  const [loading, setLoading] = useState(true);          // Loading state while API fetches
  const [currentRegNo, setCurrentRegNo] = useState(null); // Current user's registration number
  const [error, setError] = useState(null);              // Error message if API fails
  const [expandedNodes, setExpandedNodes] = useState(new Set()); // Track which nodes are expanded

  // ==================== DOM REFERENCES ====================
  const chartRef = useRef(null);  // Reference to SVG container element
  const svgRef = useRef(null);    // Reference to D3 SVG instance
  const gRef = useRef(null);      // Reference to D3 group for zoom functionality
  const navigate = useNavigate();  // React Router navigation function

  // ==================== API DATA PROCESSING ====================

  /**
   * buildTree - Converts flat API data into hierarchical tree structure
   * @param {Array} data - Flat array of nodes received from API
   * @returns {Object} - Root node of the tree with children hierarchy
   * 
   * API response example:
   * [
   *   { regno: "1", Name: "John", introRegNo: null, loginid: "john123", STATUS: "GREEN" },
   *   { regno: "2", Name: "Alice", introRegNo: "1", loginid: "alice456", STATUS: "BLUE" },
   * ]
   */
  const buildTree = useCallback((apiData) => {
    // Guard clause - return null if no data from API
    if (!Array.isArray(apiData) || apiData.length === 0) return null;

    // Map to store nodes by regno for quick lookup
    const nodeMap = {};
    let rootNode = null;

    // ===== STEP 1: Create all nodes from API data =====
    apiData.forEach((item) => {
      nodeMap[item.regno] = {
        // Spread all original API data (keeps all fields like Name, STATUS, loginid, etc.)
        ...item,
        
        // Tree structure properties
        children: [],      // Currently visible children (changes on expand/collapse)
        _children: [],     // All children (original data, never changes)
        
        // Display properties (with fallbacks)
        name: item.Name || item.name || "Member",           // Name from API
        loginid: item.loginid || "",                        // Login ID from API
        regno: item.regno,                                  // Registration number from API
        status: item.STATUS || item.BotStatus || "Active",  // Status from API
      };
    });

    // ===== STEP 2: Build parent-child relationships using introRegNo =====
    apiData.forEach((item) => {
      const parentRegNo = item.introRegNo;  // Parent's registration number from API
      const currentNode = nodeMap[item.regno];
      const parentNode = nodeMap[parentRegNo];

      // If this node has a parent that exists in our map
      if (parentRegNo && parentNode) {
        // Add this node as a child of its parent
        parentNode.children.push(currentNode);
        parentNode._children.push(currentNode);
      } 
      // If no parent found, this is the root node
      else if (!rootNode && currentNode) {
        rootNode = currentNode;
      }
    });

    console.log("🌳 Tree built from API data:", rootNode);
    return rootNode;
  }, []);

  /**
   * fetchNodeChildren - API call to get children of a specific node
   * @param {string} regno - Registration number to fetch children for
   * @returns {Array} - Array of child nodes from API
   */
  const fetchNodeChildren = useCallback(async (regno) => {
    try {
      console.log("📡 Fetching children for regno:", regno);
      
      // API call to get tree data for this registration number
      const response = await apiClient.post("/Dashboard/tree-view", { 
        mregNo: regno 
      });
      
      // Log full API response for debugging
      console.log("📦 API Response for", regno, ":", response);

      // Extract data from various possible response structures
      const childrenData = response.data?.userTree || 
                           response.data?.data || 
                           response.data || 
                           [];
      
      console.log(`✅ Found ${childrenData.length} children for regno ${regno}`);
      return childrenData;
    } catch (error) {
      console.error("❌ Error fetching children for regno:", regno, error);
      return []; // Return empty array on error
    }
  }, []);

  // ==================== USER INTERACTION HANDLERS ====================

  /**
   * handleNodeClick - Toggle expand/collapse when user clicks on a node
   * @param {Event} event - Click event
   * @param {Object} d3Node - D3 node object containing data
   */
  const handleNodeClick = useCallback(async (event, d3Node) => {
    // Stop event from bubbling up to parent elements
    event.stopPropagation();
    
    const clickedRegNo = d3Node.data.regno;
    console.log("👆 User clicked node:", clickedRegNo, d3Node.data.name);

    // Update expanded nodes set (triggers re-render)
    setExpandedNodes(prevSet => {
      const newSet = new Set(prevSet);
      
      if (newSet.has(clickedRegNo)) {
        // ===== COLLAPSE: Node is expanded, so collapse it =====
        console.log("📂 Collapsing node:", clickedRegNo);
        newSet.delete(clickedRegNo);
        d3Node.data.children = [];  // Hide children (set to empty array)
        
      } else {
        // ===== EXPAND: Node is collapsed, so expand it =====
        console.log("📂 Expanding node:", clickedRegNo);
        newSet.add(clickedRegNo);
        
        // Check if we already have children loaded from a previous API call
        if (d3Node.data._children && d3Node.data._children.length > 0) {
          // Children already loaded, just show them
          console.log("✅ Using cached children for:", clickedRegNo);
          d3Node.data.children = d3Node.data._children;
        } else {
          // Need to fetch children from API
          console.log("⏳ Fetching children for:", clickedRegNo);
          
          // Async API call
          fetchNodeChildren(clickedRegNo).then(apiChildren => {
            if (apiChildren.length > 0) {
              console.log(`✅ Received ${apiChildren.length} children from API`);
              
              // Process API data into node objects
              const childNodes = {};
              
              // Create node objects for each child
              apiChildren.forEach(child => {
                childNodes[child.regno] = {
                  ...child,
                  children: [],
                  _children: [],
                  name: child.Name || child.name || "Member",
                  loginid: child.loginid || child.regno,
                  regno: child.regno,
                  status: child.STATUS || child.BotStatus || "Active"
                };
              });
              
              // Build parent-child relationships among the new nodes
              apiChildren.forEach(child => {
                const childParentRegNo = child.introRegNo;
                if (childParentRegNo && childNodes[childParentRegNo] && childNodes[child.regno]) {
                  // Check if child already exists to avoid duplicates
                  const exists = childNodes[childParentRegNo]._children.some(
                    existingChild => existingChild.regno === child.regno
                  );
                  
                  if (!exists) {
                    childNodes[childParentRegNo]._children.push(childNodes[child.regno]);
                  }
                }
              });
              
              // Get direct children of clicked node (where introRegNo === clickedRegNo)
              const directChildren = Object.values(childNodes).filter(
                node => node.introRegNo === clickedRegNo
              );
              
              console.log(`✅ Found ${directChildren.length} direct children for`, clickedRegNo);
              
              // Update the clicked node with new children
              d3Node.data._children = directChildren;
              d3Node.data.children = directChildren;
              
              // Force re-render by creating a new tree data reference
              setTreeData({...treeData});
            }
          });
        }
      }
      
      return newSet; // Return updated Set for expandedNodes state
    });
    
  }, [treeData, fetchNodeChildren]);

  // ==================== INITIAL DATA FETCH ====================

  /**
   * fetchTreeData - Fetch initial tree data from API for a user
   * @param {string} regno - Registration number to fetch tree for
   */
  const fetchTreeData = useCallback(async (regno) => {
    // Validate input
    if (!regno) {
      setError("Registration number not found");
      setLoading(false);
      return;
    }

    try {
      // Set loading state
      setLoading(true);
      setError(null);
      setCurrentRegNo(regno);

      console.log("📡 Fetching initial tree data for regno:", regno);

      // API call
      const response = await apiClient.post("/Dashboard/tree-view", { 
        mregNo: regno 
      });
      
      console.log("tree", response);

      // Extract flat data from response
      const flatData = response.data?.userTree ||
                       response.data?.data ||
                       response.data ||
                       [];

      // Check if we got any data
      if (!Array.isArray(flatData) || flatData.length === 0) {
        console.log("⚠️ No data found for regno:", regno);
        setTreeData(null);
        setError("No network members found");
        setLoading(false);
        return;
      }

      console.log(`✅ Received ${flatData.length} records from API`);

      // Build tree structure from flat data
      const tree = buildTree(flatData);
      
      // Initially expand root node
      if (tree) {
        console.log("🌳 Tree built successfully, expanding root node:", regno);
        setExpandedNodes(new Set([regno]));
        tree.children = tree._children || [];
      }
      
      // Update state with tree data
      setTreeData(tree);

    } catch (error) {
      console.error("❌ Tree Fetch Error:", error);
      setError(error.response?.data?.message || "Failed to load tree data");
    } finally {
      setLoading(false);
    }
  }, [buildTree]);

  // ==================== LOAD INITIAL DATA ON COMPONENT MOUNT ====================
  useEffect(() => {
    const loadInitialData = () => {
      try {
        // Get user data from localStorage (from login)
        const userData = localStorage.getItem("user");
        
        if (!userData) {
          setError("User not found. Please login again.");
          setLoading(false);
          return;
        }

        // Parse user data
        const savedUser = JSON.parse(userData);
        const regno = savedUser.Regno || savedUser.regno;

        if (!regno) {
          setError("Registration number not found");
          setLoading(false);
          return;
        }

        console.log("👤 Logged in user regno:", regno);
        
        // Fetch tree data for this user
        fetchTreeData(regno);
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        setError("Invalid user data format");
        setLoading(false);
      }
    };

    loadInitialData();
  }, [fetchTreeData]);

  // ==================== D3 TREE RENDERING ====================
  useEffect(() => {
    // Don't render if no data, no container, or still loading
    if (!treeData || !chartRef.current || loading) return;

    console.log("🎨 Rendering D3 tree with", Object.keys(treeData).length, "nodes");

    // Clear previous chart to avoid duplicates
    d3.select(chartRef.current).selectAll("*").remove();

    // ===== SETUP DIMENSIONS =====
    const containerWidth = chartRef.current.parentElement.clientWidth - 40;
    const width = Math.max(928, containerWidth);
    
    // Create D3 hierarchy from our tree data
    const root = d3.hierarchy(treeData);
    
    // Spacing parameters
    const dx = 40;  // Vertical spacing between nodes
    const dy = width / (root.height + 1.5);  // Horizontal spacing

    // Create tree layout
    const tree = d3.tree().nodeSize([dx, dy]);
    
    // Sort nodes by name for consistent layout
    root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
    
    // Apply tree layout to get x,y coordinates
    tree(root);

    // ===== COMPUTE TREE EXTENT =====
    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    // Calculate final SVG height
    const height = Math.max(600, x1 - x0 + dx * 2);

    // ===== CREATE SVG WITH ZOOM =====
    const svg = d3.select(chartRef.current)
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", [-dy / 3, x0 - dx, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("style", "width: 100%;  font: 12px sans-serif; background: #fff; border-radius: 8px; cursor: grab;")
      .call(d3.zoom()
        .scaleExtent([0.3, 3])
        .filter(event => {
          // Only zoom with Ctrl+Wheel to avoid accidental zoom
          if (event.type === 'wheel') {
            return event.ctrlKey;
          }
          return true;
        })
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        }));

    svgRef.current = svg;

    // Main group for zoom transformations
    const g = svg.append("g").attr("class", "tree-group");
    gRef.current = g;

    // ===== DRAW LINKS (CONNECTIONS) =====
    g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)  // Swap x and y for horizontal layout
        .y(d => d.x));

    // ===== DRAW NODES =====
    const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 2)
      .selectAll()
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .attr("class", "d3-node")
      .style("cursor", "pointer")
      // Click handler for expand/collapse
      .on("click", function(event, d) {
        handleNodeClick(event, d);
      })
      // Hover effects
      .on("mouseenter", function() {
        d3.select(this).select("circle")
          .attr("r", 8)
          .attr("stroke-width", 3);
      })
      .on("mouseleave", function() {
        d3.select(this).select("circle")
          .attr("r", 6)
          .attr("stroke-width", 2);
      });

    // ===== ADD CIRCLES (NODE MARKERS) =====
    node.append("circle")
      .attr("fill", d => {
        const status = d.data.STATUS || d.data.BotStatus;
        
        // Root node special color
        if (d.depth === 0) return "#2563eb"; 
        
        // Expanded nodes highlight
        if (expandedNodes.has(d.data.regno)) {
          return "#f39c12"; // Orange for expanded nodes
        }
        
        // Status-based colors
        return status === "BLUE" ? "#3498db" : "#2ecc71";
      })
      .attr("r", d => expandedNodes.has(d.data.regno) ? 8 : 6)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // ===== ADD EXPAND/COLLAPSE INDICATORS (+/-) =====
    node.filter(d => d.data._children && d.data._children.length > 0)
      .append("text")
      .attr("dy", "-0.8em")
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .text(d => expandedNodes.has(d.data.regno) ? "−" : "+")
      .attr("fill", "#fff")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("stroke", "#333")
      .attr("stroke-width", "0.5");

    // ===== ADD NAME LABELS (FROM API) =====
    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children && d.children.length > 0 ? -12 : 12)
      .attr("text-anchor", d => d.children && d.children.length > 0 ? "end" : "start")
      .text(d => {
        const name = d.data.name || d.data.Name || "Member";
        // Truncate long names
        return name.length > 15 ? name.substring(0, 12) + "..." : name;
      })
      .attr("fill", "#1e293b")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("paint-order", "stroke")
      .style("font-size", "12px")
      .style("font-weight", d => d.depth === 0 ? "bold" : "normal");

    // ===== ADD LOGIN ID BELOW NAME (FROM API) =====
    node.append("text")
      .attr("dy", "1.5em")
      .attr("x", d => d.children && d.children.length > 0 ? -12 : 12)
      .attr("text-anchor", d => d.children && d.children.length > 0 ? "end" : "start")
      .text(d => d.data.loginid || d.data.regno || "")  // Show login ID from API
      .attr("fill", "#64748b")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("paint-order", "stroke")
      .style("font-size", "8px");

    // ===== ADD TOOLTIPS WITH FULL INFO =====
    node.append("title")
      .text(d => {
        const name = d.data.name || d.data.Name || "Member";
        const loginid = d.data.loginid || "";
        const status = d.data.STATUS || d.data.BotStatus || "Active";
        const children = d.data._children ? d.data._children.length : 0;
        const hasMore = children > 0;
        
        return `${name}\nLogin ID: ${loginid}\nStatus: ${status}\nChildren: ${children}\n\n${hasMore ? 'Click to expand/collapse' : 'No children to expand'}`;
      });

  }, [treeData, loading, handleNodeClick, expandedNodes]);

  // ==================== UI RENDERING ====================
  return (
    <div className="tree-page">
      
      {/* Header Section */}
      <div className="tree-header">
        <div>
          <h2>Tree View</h2>
        </div>
        
        <div className="header-actions">
          <button
            className="dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tree data from API...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => currentRegNo && fetchTreeData(currentRegNo)}
          >
            Retry
          </button>
        </div>
      )}

      {/* Instructions Note */}
      {!loading && !error && (
        <div 
          style={{
            backgroundColor: "#a09f9f",
            border: "1px solid #ffd700",
            borderRadius: "8px",
            padding: "10px 20px",
            margin: "10px 0 20px 0",
            display: "flex",
            alignItems: "center",
            color: "#ffffff",
            fontSize: "14px",
            fontFamily: "sans-serif",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}
        >
          <span style={{ marginRight: "10px", fontSize: "16px"}}>🔍</span> 
          <p style={{ margin: 0 }}>
            <strong style={{ color: "#ffd700"  }}>Note : </strong> 
            Click on any node to expand/collapse its children | 
            Nodes with <span style={{color: "#f39c12"}}>orange</span> circles are expanded |
            Hold <strong>Ctrl + Mouse Wheel</strong> to zoom
          </p>
        </div>
      )}

      {/* Tree Container */}
      <div className="tree-wrapper full-width">
        <div className="tree-container">
          {treeData ? (
            <svg ref={chartRef} className="d3-tree full-width-tree"></svg>
          ) : !loading && (
            <div className="no-data">
              <div className="no-data-icon">🌳</div>
              <h3>No Network Members Found</h3>
              <p>This member hasn't introduced anyone yet.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default TreeComponent;