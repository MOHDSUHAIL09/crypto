import React, { useEffect, useState } from "react";
import "./UserDetails.css";
import apiClient from "../../../api/apiClient";
import CustomTable from "../CustomTable/CustomTable";

const BonusReport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination state
  const [pageIndex, setPageIndex] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const regno = localStorage.getItem("regno");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBonus = async () => {
      try {
        setLoading(true);

        const res = await apiClient.get(
          `/Dashboard/member-reward/${regno}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setRecords(res.data.data);
        } else {
          setRecords([]);
        }
      } catch (error) {
        console.error("API Error:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    if (regno && token) {
      fetchBonus();
    }
  }, [regno, token]);

  // Filter records based on search term
  const filteredRecords = records.filter((row) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (row.Ranks && row.Ranks.toLowerCase().includes(searchLower)) ||
      (row.rStatus && row.rStatus.toLowerCase().includes(searchLower)) ||
      (row.Bot100_amt && row.Bot100_amt.toString().toLowerCase().includes(searchLower))
    );
  });

  // Pagination logic
  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (pageIndex - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  // Reset to first page when search term or items per page changes
  useEffect(() => {
    setPageIndex(1);
  }, [searchTerm, itemsPerPage]);

  // Navigation functions
  const goToPreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const goToNextPage = () => {
    if (pageIndex < totalPages) {
      setPageIndex(pageIndex + 1);
    }
  };

  // Generate page numbers with ellipsis
  const getPagination = () => {
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

  return (
    <div className="downline-main-wrapper mb-5">
      {/* Heading */}
      <div className="mb-4">
        <h3>Rewards Report</h3>
      </div>

      {/* ===== FILTER BAR with same classes as CapitalPayoutHistory ===== */}
      <div className="entries-search-bar entries-control">



        <div className="entries-control">
          <label>Show entries:</label>
          <select 
            className="form-select" 
            value={itemsPerPage} 
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {[10, 25, 50, 75, 100].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
            
        <div className="search-wrapper">
          <input 
            className="form-control search-input" 
            placeholder="Search records..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* Table */}
      <div className="report-card">
        <CustomTable
          columns={[
            "Sl.No.",
            "RANK",
            "MATCHING (P/O) TARGET",
            "REMAINING (P/O) TARGET",
            "REWARDS",
            "STATUS",
          ]}
          loading={loading}
        >
          {currentRecords.length > 0 ? (
            currentRecords.map((row, index) => (
              <tr key={row.rid}>
                <td className="text-center">
                  <div className="sr-no-circle">
                    {startIndex + index + 1}
                  </div>
                </td>
                <td>{row.Ranks}</td>
                <td>{row.PowerLeg} / {row.OtherLeg}</td>
                <td>{row.Remaining_PowerLeg || 0} / {row.Remaining_OtherLeg || 0}</td>
                <td>${row.Bot100_amt}</td>
                <td
                  style={{
                    fontWeight: "600",
                    color: row.rStatus === "Achieved" ? "green" : "red",
                  }}
                >
                  {row.rStatus}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                {loading ? "Loading..." : "No records found"}
              </td>
            </tr>
          )}
        </CustomTable>

        {/* Pagination (same as before) */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-5 mb-3 flex-wrap gap-md-2">
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
                onClick={() => page !== "..." && setPageIndex(page)}
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
              disabled={pageIndex === totalPages}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "clamp(28px, 6vw, 38px)",
                height: "clamp(28px, 6vw, 38px)",
                borderRadius: "50%",
                fontSize: "clamp(13px, 4vw, 16px)",
                fontWeight: "600",
                cursor: pageIndex === totalPages ? "not-allowed" : "pointer",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "white",
                color: pageIndex === totalPages ? "#ccc" : "#667eea",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
                border: "1px solid rgba(102, 126, 234, 0.2)",
                opacity: pageIndex === totalPages ? 0.5 : 1,
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

export default BonusReport;