import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomTable from "../CustomTable/CustomTable";
import './CapitalPayout.css'; 

const CapitalPayout = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination state
  const [pageIndex, setPageIndex] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

 useEffect(() => {
  fetchCapitalData();
}, []);

  const fetchCapitalData = async () => {
    setLoading(true);
    try {
      const sampleData = [
        {
          id: 1,
          investmentDate: "17/12/2025",
          amount: 1000.00,
          profit: 87.10,
          withdrawal: 0.00,
          remainingCapital: 1000.00,
          remainingDays: "",
        },
        {
          id: 2,
          investmentDate: "15/12/2025",
          amount: 500.00,
          profit: 43.55,
          withdrawal: 0.00,
          remainingCapital: 500.00,
          remainingDays: "5",
        }
      ];
      setRecords(sampleData);
    } catch (error) {
      console.error("Error fetching capital data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter records based on search term
  const filteredRecords = records.filter((row) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (row.investmentDate && row.investmentDate.toLowerCase().includes(searchLower)) ||
      (row.amount && row.amount.toString().toLowerCase().includes(searchLower)) ||
      (row.profit && row.profit.toString().toLowerCase().includes(searchLower)) ||
      (row.remainingCapital && row.remainingCapital.toString().toLowerCase().includes(searchLower))
    );
  });

  // Pagination logic
  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (pageIndex - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  useEffect(() => {
    setPageIndex(1);
  }, [searchTerm, itemsPerPage]);

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

  return (
    <div className="report-container p-2 p-md-4 mb-5">
      
      {/* Heading */}
      <div className="mb-3">
        <h2>Capital Status For Payout</h2>
      </div>
      <hr style={{ border: "1px solid #282727" }} />

      {/* Search and Items per page */}
      <div className="d-flex justify-content-between align-items-center mt-2 mb-2 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <label className="mb-0" style={{ fontSize: "14px", fontWeight: "500", color: "#555" }}>
            Show entries:
          </label>
          <select
            className="form-select"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            style={{
              backgroundColor: "var(--inputcolor)",
              width: "auto",
              height: "38px",
              borderRadius: "8px",
              border: "1px solid rgba(102, 126, 234, 0.2)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <input
            className="form-control"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              backgroundColor: "var(--inputcolor)",
              minWidth: "200px",
              borderRadius: "8px",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
          />
        </div>
      </div>

      {/* Table - Using CustomTable */}
      <div className="report-card">
        <CustomTable
          columns={[
            "Sl.No.",
            "Investment Date",
            "Amount",
            "Profit",
            "Withdrawal",
            "Remaining Capital",
            "Remaining Days",
            "Action",
          ]}
          loading={loading}
          emptyMessage="No capital data found"
        >
          {currentRecords.length > 0 ? (
            currentRecords.map((row, index) => (
              <tr key={row.id || index}>
                <td className="text-center">
                  <div className="sr-no-circle">
                    {startIndex + index + 1}
                  </div>
                 </td>
                <td className="text-center">{row.investmentDate}</td>
                <td className="text-center amount-cell">
                  ${row.amount?.toFixed(2)}
                </td>
                <td className="text-center profit-cell">
                  ${row.profit?.toFixed(2)}
                </td>
                <td className="text-center">
                  ${row.withdrawal?.toFixed(2)}
                </td>
                <td className="text-center remaining-capital">
                  ${row.remainingCapital?.toFixed(2)}
                </td>
                <td className="text-center">
                  {row.remainingDays || "-"}
                </td>
                <td className="text-center">
                  {/* ✅ FIX: Link should wrap the button */}
                  <Link to="/dashboard/capitalwithdrawalrequest" state={{ investmentData: row }}>
                    <button
                      className="capital-payout-btn"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      CAPITAL PAYOUT
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4">
                {loading ? "Loading..." : "No records found"}
              </td>
            </tr>
          )}
        </CustomTable>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-5 mb-3 flex-wrap gap-md-2">
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

            {getPagination(pageIndex, totalPages).map((page, i) => (
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
              >
                {page}
              </button>
            ))}

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

// Pagination helper function
const getPagination = (pageIndex, totalPages) => {
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

export default CapitalPayout;