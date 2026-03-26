import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomTable from "./CustomTable/CustomTable";
import apiClient from "../../api/apiClient";
import './UserDetails/UserDetails.css';

const AccStatement = () => {
  const location = useLocation();
  const columns = ["Sl.No.", "Credit", "Debit", "Date", "Type", "Remark"];
  
  const [tableData, setTableData] = useState([]); // Current page data
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Get type from URL
  const queryParams = new URLSearchParams(location.search);
  const urlType = queryParams.get("type") || "ALL";
  
  const [selectedType, setSelectedType] = useState(urlType);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(20);

  const regno = localStorage.getItem("regno");
  const token = localStorage.getItem("token");

  // Function to get display name
  const getTypeDisplayName = (typeValue) => {
    const typeMap = {
      "ALL": "All Transactions",
      "FUND WITHDRAWAL": "Fund Withdrawal",
      "INSURANCE FEE": "Insurance Fee",
      "LEVEL INCOME": "Level Income",
      "LOST IB INCOME": "Lost IB Income",
      "MATCHING INCOME": "Matching Income",
      "TRADING PASSIVE INCOME": "Trading Passive Income"
    };
    return typeMap[typeValue] || typeValue;
  };

  useEffect(() => {
    fetchStatement();
  }, [pageIndex, selectedType]);

  // Update when URL changes
  useEffect(() => {
    const newType = queryParams.get("type") || "ALL";
    setSelectedType(newType);
    setPageIndex(1);
  }, [location.search]);

  const fetchStatement = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(
        "/Dashboard/income-report",
        {
          params: {
            regno: regno,
            transtype: selectedType,
            pageIndex: pageIndex,
            pageSize: pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      const apiData = response.data?.data?.data || [];
      const total = response.data?.data?.recordCount || 0;
      setTableData(apiData);
      setTotalRecords(total);
      
      // Check if next page exists
      setHasNextPage(apiData.length === pageSize);

    } catch (error) {
      console.error("API Error:", error);
      setTableData([]);
      setHasNextPage(false);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
    setPageIndex(1);
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set("type", newType);
    window.history.pushState({}, "", url);
  };

  // Navigation functions for pagination
  const goToPreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      setPageIndex(pageIndex + 1);
    }
  };

  const goToPage = (page) => {
    setPageIndex(page);
  };

  // Generate page numbers with ellipsis
  const getPagination = () => {
    const totalPages = Math.ceil(totalRecords / pageSize);
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= pageIndex - delta && i <= pageIndex + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="container-fluid p-5 mb-5">
      <div className="report-card p-3">

        {/* Dynamic Heading */}
        <h4 className="fw-bold ms-3">
          {getTypeDisplayName(selectedType)} Statement
        </h4>
        <hr/>

        {/* TOP CONTROLS */}
        <div className="table-controls ms-3">
          <div className="entries-control">
            <select 
              className="form-select w-auto"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option value="ALL">--Select--</option>
              <option value="FUND WITHDRAWAL">Fund Withdrawal</option>
              <option value="INSURANCE FEE">Insurance Fee</option>
              <option value="LEVEL INCOME">Level Income</option>
              <option value="LOST IB INCOME">Lost IB Income</option>
              <option value="MATCHING INCOME">Matching Income</option>
              <option value="TRADING PASSIVE INCOME">Trading Passive Income</option>
            </select>
          </div>

          <div className="search-control">
            <label>Search:</label>
            <input type="text" placeholder="Search..." />
          </div>
        </div>

        {/* TABLE */}
        <CustomTable columns={columns} loading={loading}>
          {tableData.length > 0 ? (
            tableData.map((item, index) => (
              <tr key={item.id || index}>
                <div className="sr-no-circle">
           <td>{(pageIndex - 1) * pageSize + index + 1}</td>
        </div>
              
                <td className="text-success">₹ {item.credit || 0}</td>
                <td className="text-danger">₹ {item.debit || 0}</td>
                <td>
                  {item.TransDate ? new Date(item.TransDate).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  }) : ""}
                </td>
                <td>{item.transType}</td>
                <td className="remark-cell" title={item.Remark || ""}>
                  {item.Remark
                    ? item.Remark.split(" ").slice(0, 3).join(" ") + (item.Remark.split(" ").length > 3 ? "..." : "")
                    : ""
                  }
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                {loading ? "Loading..." : "No data available in table"}
              </td>
            </tr>
          )}
        </CustomTable>

        {/* Beautiful Circular Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 mb-3 flex-wrap gap-2 gap-md-3">
            {/* Previous Button */}
            <button
              onClick={goToPreviousPage}
              disabled={pageIndex === 1}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "clamp(28px, 6vw, 38px)",
                height: "clamp(28px, 6vw, 38px)",
                borderRadius: "50%",
                fontSize: "clamp(13px, 4vw, 16px)",
                fontWeight: "600",
                cursor: pageIndex === 1 ? "not-allowed" : "pointer",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "white",
                color: pageIndex === 1 ? "#ccc" : "#667eea",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
                border: "1px solid rgba(102, 126, 234, 0.2)",
                opacity: pageIndex === 1 ? 0.5 : 1,
              }}
              aria-label="Previous page"
            >
              ←
            </button>

            {/* Page Numbers */}
            {getPagination().map((page, i) => (
              <button
                key={i}
                disabled={page === "..."}
                onClick={() => page !== "..." && goToPage(page)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "clamp(28px, 6vw, 38px)",
                  height: "clamp(28px, 6vw, 38px)",
                  borderRadius: "50%",
                  fontSize: "clamp(13px, 4vw, 16px)",
                  fontWeight: pageIndex === page ? "700" : "500",
                  cursor: page === "..." ? "default" : "pointer",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: pageIndex === page
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "white",
                  color: pageIndex === page ? "#fff" : "#667eea",
                  boxShadow: pageIndex === page
                    ? "0 8px 20px rgba(102, 126, 234, 0.3), 0 2px 4px rgba(0,0,0,0.1)"
                    : "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
                  border: page === "..."
                    ? "none"
                    : pageIndex === page
                      ? "none"
                      : "1px solid rgba(102, 126, 234, 0.2)",
                  opacity: page === "..." ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (page !== "..." && pageIndex !== page) {
                    e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
                    e.currentTarget.style.backgroundColor = "#f8f9ff";
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (page !== "..." && pageIndex !== page) {
                    e.currentTarget.style.transform = "scale(1) translateY(0)";
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.2)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  }
                }}
                aria-label={page === "..." ? "More pages" : `Go to page ${page}`}
                aria-current={pageIndex === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={!hasNextPage}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "clamp(28px, 6vw, 38px)",
                height: "clamp(28px, 6vw, 38px)",
                borderRadius: "50%",
                fontSize: "clamp(13px, 4vw, 16px)",
                fontWeight: "600",
                cursor: !hasNextPage ? "not-allowed" : "pointer",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "white",
                color: !hasNextPage ? "#ccc" : "#667eea",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
                border: "1px solid rgba(102, 126, 234, 0.2)",
                opacity: !hasNextPage ? 0.5 : 1,
              }}
              aria-label="Next page"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccStatement;