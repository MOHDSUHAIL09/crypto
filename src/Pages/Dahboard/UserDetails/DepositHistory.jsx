
import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import apiClient from "../../../api/apiClient";
import CustomTable from "../CustomTable/CustomTable";
import "./UserDetails.css";

const DepositHistory = () => {
  const { userData } = useUser();


  // Deposit state (client-side pagination)
  const [historyData, setHistoryData] = useState([]);      // all deposit data
  const [filteredDepositData, setFilteredDepositData] = useState([]);
  const [depositSearchTerm, setDepositSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Client-side pagination for deposit
  const [depositCurrentPage, setDepositCurrentPage] = useState(1);
  const depositItemsPerPage = 10;
  
  const filterType =  "ALL";
  const regno = Number(userData?.regno || localStorage.getItem("regno"));
  // ========== DEPOSIT: Fetch all data once (client-side pagination) ==========
  const fetchAllDepositData = async () => {
    if (!regno) return [];
    try {
      const res = await apiClient.get("/Dashboard/topup-wallet-report", {
        params: { regno, type: "ALL", pageIndex: 1, pageSize: 10000 }
      });

      const data = res.data?.data?.data || [];
      //const filterdata = data.filter(x => x.transType !== "Balance Transfer" && x.transType !== "FundDeposit");
      setHistoryData(data);
      return data;
    } catch (err) {
      console.log("ERROR fetching deposit data:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllDepositData();
      setLoading(false);
    };
    if (regno) fetchData();
  }, [regno]);
  
  // Apply deposit filter (client-side)
  useEffect(() => {
    applyDepositFilter(historyData, filterType, depositSearchTerm);
    setDepositCurrentPage(1);
  }, [filterType, historyData, depositSearchTerm]);
  
  const applyDepositFilter = (data, type, searchTerm) => {
    if (!data || data.length === 0) {
      setFilteredDepositData([]);
      return;
    }
    let result = [...data];
    if (searchTerm) {
      result = result.filter(item =>
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (type === "P2P") {
      result = result.filter(item =>
        item.transType?.toLowerCase().includes("transfer") ||
        item.Remark?.toLowerCase().includes("p2p") ||
        item.remark?.toLowerCase().includes("p2p") ||
        item.Remark?.toLowerCase().includes("deposit to deposit")
      );
    } else if (type === "SELF") {
      result = result.filter(item =>
        item.transType?.toLowerCase().includes("self") ||
        item.Remark?.toLowerCase().includes("self") ||
        item.remark?.toLowerCase().includes("income to deposit") ||
        item.Remark?.toLowerCase().includes("self transfer")
      );
    }
    setFilteredDepositData(result);
  };
  
  // Deposit pagination helpers (client-side)
  const depositTotalRecords = filteredDepositData.length;
  const depositTotalPages = Math.ceil(depositTotalRecords / depositItemsPerPage);
  const depositStartIndex = (depositCurrentPage - 1) * depositItemsPerPage;
  const depositCurrentItems = filteredDepositData.slice(depositStartIndex, depositStartIndex + depositItemsPerPage);
  
  const goToDepositPage = (page) => {
    if (page >= 1 && page <= depositTotalPages) setDepositCurrentPage(page);
  };
  
  const getDepositPaginationNumbers = () => {
    if (depositTotalPages <= 1) return [];
    const pages = [];
    const delta = 2;  // shows 5 buttons
    let left = Math.max(1, depositCurrentPage - delta);
    let right = Math.min(depositTotalPages, depositCurrentPage + delta);
    if (right - left + 1 < 5) {
      if (left === 1) right = Math.min(depositTotalPages, 5);
      else if (right === depositTotalPages) left = Math.max(1, depositTotalPages - 4);
    }
    if (left > 1) pages.push(1, "...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < depositTotalPages) pages.push("...", depositTotalPages);
    return pages;
  };
  
  const getColumns = () => ["Sl.No.", "Date", "Credit", "Debit", "Remark"];
  
  const getTitle = () => {
    if (filterType === "P2P") return "P2P Transfer History (Deposit to Deposit)";
    if (filterType === "SELF") return "Self Transfer History (Deposit to Deposit)";
    return "Deposit Wallet History";
  };
  
  const renderRow = (item, idx) => {
    const serial = depositStartIndex + idx + 1;
    return (
      <tr key={idx}>
        <td className="text-center"><div className="sr-no-circle">{serial}</div></td>
        <td>{item.dt || "-"}</td>
        <td className="credit">${item.credit || "0.00"}</td>
        <td className="debit">${item.debit || "0.00"}</td>
        <td className="text-muted" title={item.remark || item.Remark || "-"}>{item.remark || item.Remark || "-"}</td>
      </tr>
    );
  };
  
  return (
    <div className="container-fluid p-3 mb-5">
      <div className="report-card p-3">
        <h3 className="fw-bold  mb-4">{getTitle()}</h3>
        
        <div className="entries-search-bar entries-control">
          <div className="entries-control">
            <div className="p-2" style={{ fontWeight: "500" }}>Total Balance: $00</div>
          </div>     
          <div className="search-wrapper p-2">
            <input className="search-wrapper" placeholder="Search records..."
              value={depositSearchTerm}
              onChange={(e) => setDepositSearchTerm(e.target.value)}
              style={{ backgroundColor: "var(--inputcolor)", minWidth: "250px", borderRadius: "8px", border: "1px solid rgba(102, 126, 234, 0.2)" }} />
          </div>
        </div>
        
        <CustomTable columns={getColumns()} loading={loading}>
          {depositCurrentItems.length > 0 ? depositCurrentItems.map((item, idx) => renderRow(item, idx)) : (
            <tr><td colSpan="5" className="text-center">{loading ? "Loading..." : "No data available"}</td></tr>
          )}
        </CustomTable>
        
        {/* Pagination UI - Deposit (client-side, 10 per page, max 5 buttons) */}
        {depositTotalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 mb-3 flex-wrap gap-2 gap-md-3">
            <button onClick={() => goToDepositPage(depositCurrentPage - 1)} disabled={depositCurrentPage === 1}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "clamp(28px, 6vw, 38px)", height: "clamp(28px, 6vw, 38px)", borderRadius: "50%", fontSize: "clamp(13px, 4vw, 16px)", fontWeight: "600", cursor: depositCurrentPage === 1 ? "not-allowed" : "pointer", background: "white", color: depositCurrentPage === 1 ? "#ccc" : "#667eea", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid rgba(102, 126, 234, 0.2)", opacity: depositCurrentPage === 1 ? 0.5 : 1 }}>
              ←
            </button>
            {getDepositPaginationNumbers().map((page, i) => (
              <button key={i} disabled={page === "..."} onClick={() => page !== "..." && goToDepositPage(page)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "clamp(28px, 6vw, 38px)", height: "clamp(28px, 6vw, 38px)", borderRadius: "50%", fontSize: "clamp(13px, 4vw, 16px)", fontWeight: depositCurrentPage === page ? "700" : "500", cursor: page === "..." ? "default" : "pointer", background: depositCurrentPage === page ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white", color: depositCurrentPage === page ? "#fff" : "#667eea", boxShadow: depositCurrentPage === page ? "0 8px 20px rgba(102, 126, 234, 0.3)" : "0 2px 8px rgba(0,0,0,0.08)", border: page === "..." ? "none" : depositCurrentPage === page ? "none" : "1px solid rgba(102, 126, 234, 0.2)" }}>
                {page}
              </button>
            ))}
            <button onClick={() => goToDepositPage(depositCurrentPage + 1)} disabled={depositCurrentPage === depositTotalPages}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "clamp(28px, 6vw, 38px)", height: "clamp(28px, 6vw, 38px)", borderRadius: "50%", fontSize: "clamp(13px, 4vw, 16px)", fontWeight: "600", cursor: depositCurrentPage === depositTotalPages ? "not-allowed" : "pointer", background: "white", color: depositCurrentPage === depositTotalPages ? "#ccc" : "#667eea", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid rgba(102, 126, 234, 0.2)", opacity: depositCurrentPage === depositTotalPages ? 0.5 : 1 }}>
              →
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default DepositHistory;
