import React, { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient";
import CustomTable from "../CustomTable/CustomTable";
import "./UserDetails.css";
import { Link } from "react-router-dom";

const DownlineTeam = () => {
  const [level, setLevel] = useState(0);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalBusiness, setTotalBusiness] = useState(0); 
  const pageSize = 10;
  const regno = localStorage.getItem("regno");

  // ================= API =================
  const fetchUsers = async (selectedLevel, page) => {
    if (!regno) return;
    setLoading(true);
    try {
      let findlvl;
      if (selectedLevel === 0) {
        findlvl = 0; 
      } else {
        findlvl = selectedLevel; 
      }

      const payload = {
        mregno: Number(regno),
        type: 1,
        findlvl: findlvl,
        pageIndex: page,
        pageSize: pageSize,
      };

      const response = await apiClient.post("/Dashboard/downline-team", payload);  
      console.log("📥 DownLine-Api:", response?.data);
      
      const resData = response?.data?.data?.data || [];
      let count = response?.data?.data?.recordCount || 0;
      let business = response?.data?.data?.totalBusiness || 0; // ✅ Get totalBusiness from API

      console.log("✅ API Total Business:", business);
      console.log("✅ API Total Records:", count);

      setUsers(resData);
      setTotalRecords(count);
      setTotalBusiness(business); // ✅ Set totalBusiness from API
      
    } catch (error) {
      console.error("API Error:", error);
      setUsers([]);
      setTotalRecords(0);
      setTotalBusiness(0);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when level changes
  useEffect(() => {
    setPageIndex(1);
  }, [level]);

  // Fetch users when level or pageIndex changes
  useEffect(() => {
    fetchUsers(level, pageIndex);
  }, [level, pageIndex]);

  // ================= FILTER =================
  const filteredUsers = users.filter(
    (u) =>
      u.loginid?.toLowerCase().includes(search.toLowerCase()) ||
      u.Name?.toLowerCase().includes(search.toLowerCase())
  );

  // ❌ Remove this line - don't calculate manually anymore
  // const totalBusiness = users.reduce((sum, u) => sum + (u.FundInvest || 0), 0);

  // ================= PAGINATION LOGIC =================
  const totalPages = Math.ceil(totalRecords / pageSize);

  const getPagination = () => {
    if (totalRecords === 0 || totalPages <= 1) {
      return [1];
    }

    const current = pageIndex;
    const total = totalPages;
    const pages = [];
    
    pages.push(1);
    
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);
    
    if (start > 2) {
      pages.push("...");
    }
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    if (end < total - 1) {
      pages.push("...");
    }
    
    if (total > 1 && !pages.includes(total)) {
      pages.push(total);
    }
    
    return pages;
  };

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

  const columns = ["Sl.No.", "DOWNLINE INFO", "SPONSOR", "INVESTED AMOUNT", "STATUS", "Action"];

  return (
    <div className="downline-main-wrapper mb-5">
      <h3 className="mt-4 mb-4">All Downline Team</h3>

      {/* TOP BOX */}
      <div
        className="p-3 mb-2 d-flex justify-content-between flex-wrap"
        style={{
          background: "linear-gradient(to right, var(--primary-clr), var(--secondary-clr))",
          color: "#fff",
          borderRadius: "10px",
        }}
      >
        <div>
          <label>Select Level</label>
          <select
            className="form-select w-auto"
            style={{ backgroundColor: "var(--inputcolor)" }}
            value={level}
            onChange={(e) => {
              setLevel(Number(e.target.value));
            }}
          >
            <option value={0}>All Levels</option>
            {Array.from({ length: 30 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Level {i + 1}</option>
            ))}
          </select>
        </div>
        <div>
          <p>Total Team: {totalRecords}</p>
          <p>Total Business: ${totalBusiness.toLocaleString()}</p> 
        </div>
      </div>

      {/* SEARCH */}
      <div className="d-flex justify-content-end mb-2">
        <input
          className="form-control w-auto"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ backgroundColor: "var(--inputcolor)" }}
        />
      </div>

      {/* TABLE */}
      <div className="report-card">
        <CustomTable columns={columns} loading={loading}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => {
              const serialNo = (pageIndex - 1) * pageSize + index + 1;
              const formattedNo = serialNo.toString().padStart(2, "0");

              return (
                <tr key={user.regno || index}>
                  <td className="text-center">
                    <div className="sr-no-circle mx-auto">
                      {formattedNo}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="user-name-text">{user.loginid || "N/A"}</div>
                    <div className="user-id-subtext">{user.name || "N/A"}</div>
                  </td>
                  <td className="text-center">
                    <div className="sponsor-id-text">{user.Sponsor || "N/A"}</div>
                    <div className="user-id-subtext">{user.introName || "N/A"}</div>
                  </td>
                  <td className="text-center">
                    <div className="amount-text-green">
                      {user.FundInvest > 0 ? `$${user.FundInvest.toLocaleString()}` : "$0"}
                    </div>
                    <div className="date-subtext">
                      {user.TopupDate || "-"}
                    </div>
                  </td>
                  <td className="pe-3">
                    <div className={`status-pill mx-auto ${user.kitPrice > 0 ? "active" : "inactive"}`}>
                      <span className="dot"></span>
                      {user.kitPrice > 0 ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="pe-3">
                    <Link
                      to={`/dashboard/downlineUserHistory?regno=${user.regno}&loginid=${user.loginid}`}
                      className="capital-payout-btn"
                      style={{ padding: "12px 20px" }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-5">
                {loading ? "Loading..." : "No records found"}
              </td>
            </tr>
          )}
        </CustomTable>

        {/* PAGINATION */}
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
                onClick={() => page !== "..." && setPageIndex(page)}
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

export default DownlineTeam;