import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import apiClient from "../../../api/apiClient";
import CustomTable from "../CustomTable/CustomTable";
import { useLocation } from "react-router-dom";
import "./UserDetails.css";

const DepositHistory = () => {
  const { userData } = useUser();
  const location = useLocation();

  const [historyData, setHistoryData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [depositSearchTerm, setDepositSearchTerm] = useState("");
  const [incomeSearchTerm, setIncomeSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Get tab from location state, default to "deposit"
  const initialTab = location.state?.tab || "deposit";
  const [activeTab] = useState(initialTab);
  const filterType = location.state?.type || "ALL";

  // Transaction type for income data (like AccStatement)
  const [selectedTransType, setSelectedTransType] = useState("fundtransfer");

  const regno = Number(userData?.regno || localStorage.getItem("regno"));
  const token = localStorage.getItem("token");

  // Transaction type options
  const transactionTypes = [
    { value: "fundtransfer", label: "Fund Transfer" },
    { value: "levelincome", label: "Level Income" },
    { value: "matchingincome", label: "Matching Income" },
    { value: "tradingpassiveincome", label: "Trading Passive Income" },
    { value: "lostibincome", label: "Lost IB Income" },
    { value: "fundwithdrawal", label: "Fund Withdrawal" },
    { value: "insurancefee", label: "Insurance Fee" },
    { value: "ALL", label: "All Transactions" }
  ];

  // ================= FETCH DEPOSIT DATA =================
  const fetchDepositData = async () => {
    if (!regno) return [];

    try {
      const res = await apiClient.get("/Dashboard/topup-wallet-report", {
        params: {
          regno,
          type: "ALL",
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
      });

      const data = res.data?.data?.data || [];
      const total = res.data?.data?.recordCount || 0;
      setHistoryData(data);
      setTotalRecords(total);
      setHasNextPage(data.length === pageSize);
      return data;
    } catch (err) {
      console.log("ERROR fetching deposit data:", err);
      return [];
    }
  };

 // ================= FETCH INCOME DATA =================
  const fetchIncomeData = async () => {
    if (!regno) return [];

    try {
      const res = await apiClient.get("/Dashboard/income-report", {
        params: {
          regno: regno,
          transtype: selectedTransType,
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data?.data?.data || [];
      const total = res.data?.data?.recordCount || 0;
      setIncomeData(data);
      setTotalRecords(total);
      setHasNextPage(data.length === pageSize);
      return data;
    } catch (err) {
      console.log("ERROR fetching income data:", err);
      return [];
    }
  };

  // ================= FETCH ALL DATA =================
  useEffect(() => {
    const fetchAllData = async () => {
      if (!regno) return;

      try {
        setLoading(true);

        if (activeTab === "deposit") {
          await fetchDepositData();
        } else {
          await fetchIncomeData();
        }

      } catch (err) {
        console.log("ERROR fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [regno, activeTab, pageIndex, selectedTransType]);

  // Apply filter when data or activeTab or filterType changes
  useEffect(() => {
    if (activeTab === "deposit") {
      applyDepositFilter(historyData, filterType);
    } else {
      applyIncomeFilter(incomeData, filterType);
    }
  }, [activeTab, filterType, historyData, incomeData, depositSearchTerm, incomeSearchTerm]);

  // ================= FILTER DEPOSIT DATA =================
  const applyDepositFilter = (data, type) => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    let result = [...data];

    // Apply search filter for deposit
    if (depositSearchTerm) {
      result = result.filter((item) =>
        JSON.stringify(item)
          .toLowerCase()
          .includes(depositSearchTerm.toLowerCase())
      );
    }

    // Apply type filter for DEPOSIT data
    if (type === "P2P") {
      result = result.filter(
        (item) =>
          item.transType?.toLowerCase().includes("transfer") ||
          item.Remark?.toLowerCase().includes("p2p") ||
          item.remark?.toLowerCase().includes("p2p") ||
          item.Remark?.toLowerCase().includes("deposit to deposit")
      );
    } else if (type === "SELF") {
      result = result.filter(
        (item) =>
          item.transType?.toLowerCase().includes("self") ||
          item.Remark?.toLowerCase().includes("self") ||
          item.remark?.toLowerCase().includes("income to deposit") ||
          item.Remark?.toLowerCase().includes("self transfer")
      );
    }

    setFilteredData(result);
  };

  // ================= FILTER INCOME DATA =================
  const applyIncomeFilter = (data, type) => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    let result = [...data];

    // Apply search filter for income
    if (incomeSearchTerm) {
      result = result.filter((item) =>
        JSON.stringify(item)
          .toLowerCase()
          .includes(incomeSearchTerm.toLowerCase())
      );
    }

    // Apply type filter for INCOME data
    if (type === "SELF") {
      result = result.filter(
        (item) =>
          item.transType?.toLowerCase().includes("fundtransfer") ||
          item.Remark?.toLowerCase().includes("self") ||
          item.Remark?.toLowerCase().includes("income to deposit") ||
          item.Remark?.toLowerCase().includes("wallet transfer")
      );
    } else if (type === "P2P") {
      result = result.filter(
        (item) =>
          item.transType?.toLowerCase().includes("transfer") ||
          item.Remark?.toLowerCase().includes("p2p")
      );
    }

    setFilteredData(result);
  };

  // Handle transaction type change
  const handleTransTypeChange = (event) => {
    setSelectedTransType(event.target.value);
    setPageIndex(1);

    const url = new URL(window.location);
    url.searchParams.set("transtype", event.target.value);
    window.history.pushState({}, "", url);
  };

  // Format date for income data
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return dateString;
    }
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

  // Get columns based on active tab
  const getColumns = () => {
    if (activeTab === "deposit") {
      return ["Sl.No.", "Date", "Credit", "Debit", "Remark"];
    } else {
      return ["Sl.No.", "Date", "Credit", "Debit", "Remark", "Status"];
    }
  };

  // Get title based on active tab and filter type
  const getTitle = () => {
    if (activeTab === "deposit") {
      if (filterType === "P2P") {
        return "P2P Transfer History (Deposit to Deposit)";
      } else if (filterType === "SELF") {
        return "Self Transfer History (Deposit to Deposit)";
      }
      return "Deposit Wallet History";
    } else {
      const transTypeLabel = transactionTypes.find(t => t.value === selectedTransType)?.label || selectedTransType;
      if (filterType === "SELF") {
        return `${transTypeLabel} Statement`;
      } else if (filterType === "P2P") {
        return `P2P Transfer History - ${transTypeLabel}`;
      }
      return `${transTypeLabel} Report`;
    }
  };

  // Render row based on active tab
  const renderRow = (item, index) => {
    if (activeTab === "deposit") {
      return (
        <tr key={index}>
          <td className="text-center">
            <div className="sr-no-circle">
              {(pageIndex - 1) * pageSize + index + 1}
            </div>
            </td>
          <td>{item.dt || "-"}</td>
          <td className="credit">${item.credit || "0.00"}</td>
          <td className="debit">${item.debit || "0.00"}</td>
          <td className="text-muted" title={item.remark || item.Remark || "-"}>
            {item.remark || item.Remark || "-"}
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={index}>
          <td className="text-center">
            <div className="sr-no-circle">
              {(pageIndex - 1) * pageSize + index + 1}
            </div>
          </td>
          <td>{formatDate(item.TransDate)}</td>
          <td className="credit">${item.credit || "0.00"}</td>
          <td className="debit">${item.debit || "0.00"}</td>
          <td className="text-muted" title={item.Remark || "-"}>
            {item.Remark ?
              item.Remark.split(" ").slice(0, 3).join(" ") + (item.Remark.split(" ").length > 3 ? "..." : "")
              : "-"
            }
          </td>
          <td>
            <span className={`status-badge ${item.status?.toLowerCase() === 'approved' ? 'status-approved' : 'status-pending'}`}>
              {item.status || "-"}
            </span>
          </td>
        </tr>
      );
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="container-fluid p-3 mb-5">
      <div className="report-card p-3">

        {/* Dynamic Heading */}
        <h4 className="fw-bold ms-3">
          {getTitle()}
        </h4>
        <hr />

        {/* TABLE CONTROLS */}
        <div className="table-controls">
          <div className="entries-control d-flex justify-content-between align-items-center flex-wrap gap-2">
            {activeTab === "income" && (
              <select
                className="form-select"
                value={selectedTransType}
                onChange={handleTransTypeChange}
                style={{
                  backgroundColor: "var(--inputcolor)",
                  width: "auto",
                  borderRadius: "8px",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {transactionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            )}

            <div className="me-3 mt-2" style={{ fontWeight: "500", color: "#667eea" }}>
              Total Balance: $00
            </div>
          </div>

          {/* Search Input */}
          <div className="d-flex justify-content-end mt-2 mb-2">
            <div className="d-flex align-items-center gap-2">
              <input
                className="form-control"
                placeholder="Search records..."
                value={activeTab === "deposit" ? depositSearchTerm : incomeSearchTerm}
                onChange={(e) =>
                  activeTab === "deposit"
                    ? setDepositSearchTerm(e.target.value)
                    : setIncomeSearchTerm(e.target.value)
                }
                style={{
                  backgroundColor: "var(--inputcolor)",
                  minWidth: "250px",
                  borderRadius: "8px",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                }}
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <CustomTable columns={getColumns()} loading={loading}>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={activeTab === "deposit" ? "5" : "6"} className="text-center">
                {loading ? "Loading..." : "No data available"}
              </td>
            </tr>
          )}
        </CustomTable>

        {/* Entry info */}
        {totalRecords > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3 mb-2 flex-wrap gap-2">
            <div style={{ fontSize: "14px", color: "#6c757d" }}>
              Showing {(pageIndex - 1) * pageSize + 1} to {Math.min(pageIndex * pageSize, totalRecords)} of {totalRecords} entries
            </div>
          </div>
        )}

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

export default DepositHistory;