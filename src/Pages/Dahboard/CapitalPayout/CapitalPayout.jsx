import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import CustomTable from "../CustomTable/CustomTable";
import { useUser } from "../../../context/UserContext";
import apiClient from "../../../api/apiClient";
import "./CapitalPayout.css";

// ---------- Pagination helper (unchanged) ----------
const getPagination = (current, total) => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  range.forEach((i) => {
    if (l) {
      if (i - l === 2) rangeWithDots.push(l + 1);
      else if (i - l !== 1) rangeWithDots.push("...");
    }
    rangeWithDots.push(i);
    l = i;
  });
  return rangeWithDots;
};

// ---------- Reusable Pagination Component ----------
const Pagination = ({ pageIndex, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="d-flex justify-content-center align-items-center mt-5 mb-3 flex-wrap gap-md-2">
      <button
        onClick={() => onPageChange(pageIndex - 1)}
        disabled={pageIndex === 1}
        className="pagination-btn"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "clamp(28px, 6vw, 38px)", height: "clamp(28px, 6vw, 38px)",
          borderRadius: "50%", fontSize: "clamp(13px, 4vw, 16px)", fontWeight: "600",
          cursor: pageIndex === 1 ? "not-allowed" : "pointer",
          background: "white", color: pageIndex === 1 ? "#ccc" : "#667eea",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
          border: "1px solid rgba(102, 126, 234, 0.2)", opacity: pageIndex === 1 ? 0.5 : 1,
        }}
      >←</button>

      {getPagination(pageIndex, totalPages).map((page, i) => (
        <button
          key={i}
          disabled={page === "..."}
          onClick={() => page !== "..." && onPageChange(page)}
          className="pagination-btn"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "clamp(28px, 6vw, 38px)", height: "clamp(28px, 6vw, 38px)",
            borderRadius: "50%", fontSize: "clamp(13px, 4vw, 16px)",
            fontWeight: pageIndex === page ? "700" : "500",
            cursor: page === "..." ? "default" : "pointer",
            background: pageIndex === page ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white",
            color: pageIndex === page ? "#fff" : "#667eea",
            boxShadow: pageIndex === page ? "0 8px 20px rgba(102,126,234,0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
            border: page === "..." ? "none" : pageIndex === page ? "none" : "1px solid rgba(102,126,234,0.2)",
            opacity: page === "..." ? 0.7 : 1,
          }}
        >{page}</button>
      ))}

      <button
        onClick={() => onPageChange(pageIndex + 1)}
        disabled={pageIndex === totalPages}
        className="pagination-btn"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "clamp(28px, 6vw, 38px)", height: "clamp(28px, 6vw, 38px)",
          borderRadius: "50%", fontSize: "clamp(13px, 4vw, 16px)", fontWeight: "600",
          cursor: pageIndex === totalPages ? "not-allowed" : "pointer",
          background: "white", color: pageIndex === totalPages ? "#ccc" : "#667eea",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
          border: "1px solid rgba(102, 126, 234, 0.2)", opacity: pageIndex === totalPages ? 0.5 : 1,
        }}
      >→</button>
    </div>
  );
};

// ---------- Main Component ----------
const CapitalPayout = () => {
  const { userData, loading: userLoading } = useUser();
  const regno = userData?.Regno || userData?.regno || userData?.regNo || localStorage.getItem("regno");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch data when regno is available
  useEffect(() => {
    if (regno) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await apiClient.get(`/IncomePayout/capital-payout-status/${regno}`);
          console.log("api", res)
          if (res.data?.success && res.data?.response?.data) {
            const mapped = res.data.response.data.map((item, idx) => ({
              id: item.Rid || idx,
              investmentDate: item.Rdate ? new Date(item.Rdate).toLocaleDateString("en-GB") : "-",
              amount: item.Rkprice || 0,
              profit: item.Rpayid || 0,
              withdrawal: item.incomePercent,
              remainingCapital: item.payout || 0,
              remainingDays: item.Remainingdays ?? "-",
            }));
            setRecords(mapped);
          } else {
            setRecords([]);
          }
        } catch (err) {
          console.error(err);
          setRecords([]);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (!userLoading && !regno) {
      setLoading(false);
    }
  }, [regno, userLoading]);

  // Filter & Pagination
  const filteredRecords = useMemo(() => {
    if (!searchTerm) return records;
    const lower = searchTerm.toLowerCase();
    return records.filter(row =>
      (row.investmentDate?.toLowerCase().includes(lower)) ||
      row.amount.toString().includes(lower) ||
      row.profit.toString().includes(lower) ||
      row.remainingCapital.toString().includes(lower)
    );
  }, [records, searchTerm]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const start = (pageIndex - 1) * itemsPerPage;
  const currentRecords = filteredRecords.slice(start, start + itemsPerPage);

  useEffect(() => setPageIndex(1), [searchTerm, itemsPerPage]);

  const columns = ["Sl.No.", "Investment Date", "Amount", "Profit", "Withdrawal", "Remaining Capital", "Remaining Days", "Action"];

  return (
    <div className="downline-main-wrapper report-container p-2 p-md-4 mb-5">
      <div className="mb-3 d-flex justify-content-between"><h2>Capital Status For Payout</h2>
        <Link to="/dashboard/CapitalPayoutHistory">
          <div className="text-small">Capital Payout history </div>
        </Link>
      </div>
      <hr style={{ border: "1px solid #999494" }} />

      {/* Controls */}
      <div className="entries-search-bar entries-control">
        <div className="entries-control">
          <label>Show entries:</label>
          <select className="form-select" value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}>
            {[10, 25, 50, 75, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="search-wrapper">
          <input
            className="form-control search-input"
            placeholder="Search records..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="report-card">
        <CustomTable columns={columns} loading={loading} loaderSize="md" loaderText="Loading capital data..." >
          {!loading && currentRecords.map((row, idx) => {
            const isRemainingZero = Number(row.remainingDays) === 0;
            return (
              <tr key={row.id}>
                <td className="text-center"><div className="sr-no-circle">{start + idx + 1}</div></td>
                <td className="text-center">{row.investmentDate}</td>
                <td className="text-center amount-cell">${row.amount.toFixed(2)}</td>
                <td className="text-center profit-cell">${row.profit.toFixed(2)}</td>
                <td className="text-center">${row.withdrawal.toFixed(2)}</td>
                <td className="text-center remaining-capital">${row.remainingCapital.toFixed(2)}</td>
                <td className="text-center">{row.remainingDays === undefined ? "-" : row.remainingDays}</td>
                <td className="text-center">
                  <Link to={isRemainingZero ? `/dashboard/capitalwithdrawalrequest?Capital=${row.id}` : "#"}>
                    <button
                      className="capital-payout-btn"
                      disabled={!isRemainingZero}
                      title={!isRemainingZero ? `Withdraw available only after remaining days become 0 (Current: ${row.remainingDays})` : "Click to withdraw capital"}
                      style={{ opacity: !isRemainingZero ? 0.6 : 1, cursor: !isRemainingZero ? "not-allowed" : "pointer" }}
                    >
                      CAPITAL PAYOUT
                    </button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </CustomTable>

        <Pagination pageIndex={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
        {!loading && filteredRecords.length === 0 && <div className="text-center py-4"></div>}
      </div>
    </div>
  );
};

export default CapitalPayout; 