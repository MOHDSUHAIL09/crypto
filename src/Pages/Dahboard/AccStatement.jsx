import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomTable from "./CustomTable/CustomTable";
import apiClient from "../../api/apiClient";
import './UserDetails/UserDetails.css';

const AccStatement = () => {
  const location = useLocation();
  const columns = ["Sl.No.", "Credit", "Debit", "Date", "Type", "Remark"];
  
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Get type from URL
  const queryParams = new URLSearchParams(location.search);
  const urlType = queryParams.get("type") || "ALL";

  const stateType = location.state?.transtype || location.state?.type;
  
  // ✅ FIX: Map URL param to correct API value
  let initialSelectedType = urlType;
  
  // Map "fundtransfer" to "Fund Transfer" for API
  if (urlType === "fundtransfer") {
    initialSelectedType = "Fund Transfer";
  }
  // Map state type
  if (stateType === "Fund Transfer" || stateType === "FUND TRANSFER" || stateType === "fundtransfer") {
    initialSelectedType = "Fund Transfer";
  }
  
  const [selectedType, setSelectedType] = useState(initialSelectedType);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);

  const regno = localStorage.getItem("regno");

  // ✅ Function to get API param value from display type
  const getApiTypeValue = (displayType) => {
    const typeMap = {
      "ALL": "ALL",
      "Fund Transfer": "Fund Transfer",
      "FUND WITHDRAWAL": "FUND WITHDRAWAL",
      "INSURANCE FEE": "INSURANCE FEE",
      "LEVEL INCOME": "LEVEL INCOME",
      "LOST IB INCOME": "LOST IB INCOME",
      "MATCHING INCOME": "MATCHING INCOME",
      "TRADING PASSIVE INCOME": "TRADING PASSIVE INCOME"
    };
    return typeMap[displayType] || displayType;
  };

  // Function to get display name
  const getTypeDisplayName = (typeValue) => {
    const typeMap = {
      "ALL": "All Transactions",
      "Fund Transfer": "Fund Transfer",
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

  useEffect(() => {
    const newTypeParam = queryParams.get("type") || "ALL";
    let newType = newTypeParam;
    
    // ✅ Map URL param to correct value
    if (newTypeParam === "fundtransfer") {
      newType = "Fund Transfer";
    }
    
    if (newType !== selectedType && !location.state?.transtype) {
      setSelectedType(newType);
      setPageIndex(1);
    }
  }, [location.search]);

  const fetchStatement = async () => {
    try {
      setLoading(true);
      // ✅ Send the API value (display value is already correct)
      const apiType = getApiTypeValue(selectedType);
      
      console.log("📤 API Request:", {
        regno: regno,
        transtype: apiType,
        pageIndex: pageIndex,
        pageSize: pageSize,
      });
      
      const response = await apiClient.get("/Dashboard/income-report", {
        params: {
          regno: regno,
          transtype: apiType,
          pageIndex: pageIndex,
          pageSize: pageSize,
        },  
      });
      
      console.log("📥 API Response:", response.data);
      
      const apiData = response.data?.data?.data || [];
      const total = response.data?.data?.recordCount || 0;
      setTableData(apiData);
      setTotalRecords(total);
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
    
    // ✅ Update URL with correct param
    let urlParam = newType;
    if (newType === "Fund Transfer") {
      urlParam = "fundtransfer";
    }
    
    const url = new URL(window.location);
    url.searchParams.set("type", urlParam);
    window.history.pushState({}, "", url);
  };

  const goToPreviousPage = () => {
    if (pageIndex > 1) setPageIndex(pageIndex - 1);
  };
  
  const goToNextPage = () => {
    if (hasNextPage) setPageIndex(pageIndex + 1);
  };
  
  const goToPage = (page) => setPageIndex(page);

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
    <div className="container-fluid p-2 mb-5">
      <div className="report-card p-3">
        <h3 className="fw-bold mb-4">{getTypeDisplayName(selectedType)} Statement</h3>

        <div className="entries-search-bar entries-control">
          <div className="">
            <select
              className="form-select w-auto"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option value="ALL">--Select--</option>
              <option value="Fund Transfer">Fund Transfer</option>
              <option value="FUND WITHDRAWAL">Fund Withdrawal</option>
              <option value="INSURANCE FEE">Insurance Fee</option>
              <option value="LEVEL INCOME">Level Income</option>
              <option value="LOST IB INCOME">Lost IB Income</option>
              <option value="MATCHING INCOME">Matching Income</option>
              <option value="TRADING PASSIVE INCOME">Trading Passive Income</option>
            </select>
          </div>
          <div className="search-control mt-2 mb-2">
            <input type="text" placeholder="Search..." />
          </div>
        </div>

        <CustomTable columns={columns} loading={loading}>
          {tableData.length > 0 ? (
            tableData.map((item, index) => (
              <tr key={item.id || index}>
                <td className="text-center">
                  <div className="sr-no-circle">{(pageIndex - 1) * pageSize + index + 1}</div>
                </td>
                <td className="text-success">$ {item.credit || 0}</td>
                <td className="text-danger">$ {item.debit || 0}</td>
                <td>
                  {item.TransDate
                    ? new Date(item.TransDate).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })
                    : ""}
                </td>
                <td>{item.transType}</td>
                <td className="remark-cell" title={item.Remark || ""}>
                  {item.Remark
                    ? item.Remark.split(" ").slice(0, 3).join(" ") +
                      (item.Remark.split(" ").length > 3 ? "..." : "")
                    : ""}
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

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 mb-3 flex-wrap gap-2 gap-md-3">
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
                  fontSize: "12px",
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