import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import CustomTable from "../CustomTable/CustomTable";

const BonusReport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination state
  const [pageIndex, setPageIndex] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const regno = localStorage.getItem("regno");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRoyalStatus = async () => {
      try {
        setLoading(true);

        const res = await apiClient.get(
          `/Dashboard/member-royalty/${regno}`,
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
      fetchRoyalStatus();
    }
  }, [regno, token]);

  // Filter records based on search term
  const filteredRecords = records.filter((row) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (row.Designation && row.Designation.toLowerCase().includes(searchLower)) ||
      (row.BusinessTarget && row.BusinessTarget.toString().toLowerCase().includes(searchLower)) ||
      (row.gift && row.gift.toString().toLowerCase().includes(searchLower)) ||
      (row.rStatus && row.rStatus.toLowerCase().includes(searchLower))
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



  const columns = [
    "Sl.No.",
    "RANK",
    "BUSINESS",
    "OTHER LEG",
    "ROYALTY",
    "STATUS",
  ];

  return (
    <div className="downline-main-wrapper mb-5">
      <h4 className="mb-3">Royal Status</h4>
      <hr style={{ border: "1px solid #706e6e" }} />


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

















      <div className="report-card ">
        <CustomTable columns={columns} loading={loading}>
          {currentRecords.length > 0 ? (
            currentRecords.map((row, index) => (
              <tr key={row.rid}>
                {/* Sl.No */}
                <td className="text-center">
                  <div className="sr-no-circle">
                    {startIndex + index + 1}
                  </div>
                </td>

                <td>{row.Designation}</td>

                <td>{row.BusinessTarget}</td>

                <td>
                  {row.PowerLeg} / {row.Rem_powerLeg}
                </td>

                <td>{row.gift}</td>

                <td
                  style={{
                    border: "2px double #e5e5e5",
                    padding: "10px",
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
              <td colSpan={columns.length} className="text-center py-4">
                {loading ? "Loading..." : "No records found"}
              </td>
            </tr>
          )}
        </CustomTable>

        {/* Entry info */}
        {/* {totalItems > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3 mb-2 flex-wrap gap-2">
            <div style={{ fontSize: "14px", color: "#6c757d" }}>
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
            </div>
          </div>
        )} */}

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