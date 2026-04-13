import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import apiClient from "../../../api/apiClient";
import CustomTable from "../CustomTable/CustomTable";
import "./UserDetails.css";

const DownlineUserHistory = () => {
  const { userData } = useUser();
  const [searchParams] = useSearchParams();
  const targetRegno = searchParams.get("regno");
  const targetLoginid = searchParams.get("loginid");  

  const [downlineData, setDownlineData] = useState([]);
  const [targetUserInfo, setTargetUserInfo] = useState(null); // store loginid & regno
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const columns = ["S.No.", "DOWNLINE INFO", "SPONSOR", "INVESTED AMOUNT", "Status"];


  // Fetch downline data (same as before)
  useEffect(() => {
    const fetchDownline = async () => {
      const regno = targetRegno || userData?.regno || userData?.Regno;
      if (!regno) {
        setDownlineData([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const payload = {
          mregno: Number(regno),
          type: 1,
          findlvl: -1,
          pageIndex: 1,
          pageSize: 10000,
        };
        const response = await apiClient.post("/Dashboard/downline-team", payload);
        let apiData = response?.data?.data?.data || [];
        if (apiData.length === 0) {
          setDownlineData([]);
          setLoading(false);
          return;
        }
        const records = apiData.map((item) => ({
          id: item.regno,
          loginid: item.loginid || "N/A",
          name: item.Name || "N/A",
          regno: item.regno,
          sponsor: item.Sponsor || "N/A",
          sponsername: item.sponsername || "N/A",
          fundInvest: item.FundInvest || 0,
          status: item.kitPrice > 0 ? "Active" : "Inactive",
        }));
        setDownlineData(records);
      } catch (err) {
        console.error("API Error:", err);
        setDownlineData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDownline();
  }, [targetRegno, userData]);

  // Filter & pagination
  const filteredData = useMemo(() => {
    if (!searchTerm) return downlineData;
    const lower = searchTerm.toLowerCase();
    return downlineData.filter(
      (row) =>
        row.loginid.toLowerCase().includes(lower) ||
        row.name.toLowerCase().includes(lower) ||
        row.sponsor.toLowerCase().includes(lower)
    );
  }, [downlineData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (pageIndex - 1) * itemsPerPage;
  const currentRecords = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setPageIndex(1);
  }, [searchTerm, itemsPerPage]);

  // Pagination handlers
  const goToPreviousPage = () => {
    if (pageIndex > 1) setPageIndex(pageIndex - 1);
  };
  const goToNextPage = () => {
    if (pageIndex < totalPages) setPageIndex(pageIndex + 1);
  };
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
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    });
    return rangeWithDots;
  };

  return (
    <div className="downline-main-wrapper downline-history-container p-3 mb-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <h2>
          Downline User{" "}
        {targetRegno ? `( ${targetLoginid || "N/A"} )` : ""}   
        </h2>
        {/* {targetRegno && (
          <Link to="/dashboard/downline-team" className="btn btn-sm btn-outline-secondary">
            ← Back to My Downline
          </Link>
        )} */}
      </div>
      <hr />

      <div className="entries-control   d-flex justify-content-between flex-wrap mb-3 gap-2">
        <div className="d-flex gap-2 entries-control ">
          <label>Show entries:</label>
          <select className="form-select w-auto" value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}>
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <input className="form-control w-auto" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="table-responsive">
        <CustomTable columns={columns} loading={loading} loaderSize="md" loaderText="Loading downline...">
          {!loading &&
            currentRecords.map((row, idx) => (
              <tr key={row.id}>
                <td className="text-center ">
                  <div className="sr-no-circle mx-auto">{startIndex + idx + 1}</div>
                </td>
                <td className="text-center">
                  <div className="user-name-text">{row.loginid}</div>
                  <div className="user-id-subtext">{row.name}</div>
                </td>
                <td className="text-center">
                  <div className="sponsor-id-text">{row.sponsor}</div>
                  <div className="user-id-subtext">{row.sponsername}</div>
                </td>
                <td className="text-center amount-text-green">${row.fundInvest.toLocaleString()}</td>
                <td className="text-center">
                  <div className={`status-pill mx-auto ${row.status === "Active" ? "active" : "inactive"}`}>
                    <span className="dot"></span> {row.status}
                  </div>
                </td>
              </tr>
            ))}
        </CustomTable>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-5 mb-3 flex-wrap gap-md-2">
          <button
            onClick={goToPreviousPage}
            disabled={pageIndex === 1}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "clamp(28px, 6vw, 38px)", height: "clamp(28px, 6vw, 38px)",
              borderRadius: "50%", fontSize: "clamp(13px, 4vw, 16px)", fontWeight: "600",
              cursor: pageIndex === 1 ? "not-allowed" : "pointer",
              background: "white", color: pageIndex === 1 ? "#ccc" : "#667eea",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid rgba(102,126,234,0.2)",
              opacity: pageIndex === 1 ? 0.5 : 1,
            }}
          >←</button>

          {getPagination().map((page, i) => (
            <button
              key={i}
              disabled={page === "..."}
              onClick={() => page !== "..." && setPageIndex(page)}
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
              onMouseEnter={(e) => {
                if (page !== "..." && pageIndex !== page) {
                  e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
                  e.currentTarget.style.backgroundColor = "#f8f9ff";
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(102,126,234,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (page !== "..." && pageIndex !== page) {
                  e.currentTarget.style.transform = "scale(1) translateY(0)";
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = "rgba(102,126,234,0.2)";
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
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "clamp(28px, 6vw, 38px)", height: "clamp(28px, 6vw, 38px)",
              borderRadius: "50%", fontSize: "clamp(13px, 4vw, 16px)", fontWeight: "600",
              cursor: pageIndex === totalPages ? "not-allowed" : "pointer",
              background: "white", color: pageIndex === totalPages ? "#ccc" : "#667eea",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid rgba(102,126,234,0.2)",
              opacity: pageIndex === totalPages ? 0.5 : 1,
            }}
          >→</button>
        </div>
      )}
    </div>
  );
};

export default DownlineUserHistory;