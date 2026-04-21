import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import apiClient from '../../../api/apiClient';
import CustomTable from '../CustomTable/CustomTable';
// import './CapitalPayoutHistory.css';

const CapitalPayoutHistory = () => {
  const { userData, loading: userLoading } = useUser();

  // Helper to get regno from context or localStorage
  const getRegNo = () => {
    if (userData?.regno) return userData.regno || userData.Regno;
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsed = JSON.parse(storedUserData);
        if (parsed.regno) return parsed.regno || parsed.Regno;
      } catch (e) {}
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.Regno) return user.Regno || user.regno;
    return localStorage.getItem('regno') || '1';
  };

  const regno = getRegNo();

  // State
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination & filter state (missing in your version)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data when regno is available
  useEffect(() => {
    if (!regno) return;
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.get(`/IncomePayout/capital-payout-history/${regno}`);
        if (response.data?.success) {
          const data = response.data.response?.data || [];
          const formatted = data.map((item, idx) => ({
            id: idx,
            debit: item.debit,
            date: item.TransDate,
            type: item.transType,
            remark: item.Remark,
            status: item.status,
          }));
          setHistory(formatted);
        } else {
          setError(response.data?.message || 'Failed to load data');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Server error');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [regno]);

  // Reset page when search or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Filter records based on search term
  const filteredHistory = history.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.debit?.toString().toLowerCase().includes(searchLower)) ||
      (item.date?.toLowerCase().includes(searchLower)) ||
      (item.type?.toLowerCase().includes(searchLower)) ||
      (item.remark?.toLowerCase().includes(searchLower)) ||
      (item.status?.toLowerCase().includes(searchLower))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Table columns
  const columns = ['SI.No.', 'Debit', 'Date', 'Type', 'Remark', 'Status'];

  // Build table rows
  const tableRows = currentData.map((item, idx) => {
    const serialNo = startIndex + idx + 1;
    const debitAmount = typeof item.debit === 'number' ? item.debit.toFixed(2) : item.debit;
    const formattedDate = item.date !== '-' && item.date
      ? new Date(item.date).toLocaleDateString('en-GB')
      : '-';
    const statusClass = (item.status || 'pending').toLowerCase();

    return (
      <tr key={item.id}>
        <td className="text-center">{serialNo}</td>
        <td className="text-center amount-cell">${debitAmount}</td>
        <td className="text-center">{formattedDate}</td>
        <td className="text-center">{item.type || '-'}</td>
        <td className="text-center">{item.remark || '-'}</td>
        <td className="text-center">
          <span className={`status-badge ${statusClass}`}>
            {item.status || 'Pending'}
          </span>
        </td>
      </tr>
    );
  });

  if (userLoading) {
    return <div className="p-4 text-center">Loading user...</div>;
  }

  return (
    <div className="downline-main-wrapper capital-payout-history-wrapper p-4">
      <h4 className="mb-4">Capital Payout History</h4>

      {/* Filter Bar - moved above table for better UX */}
      <div className="entries-search-bar entries-control">
        <div className="entries-control">
          <label>Show entries:</label>
          <select
            className="form-select"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {[10, 25, 50, 75, 100].map((n) => (
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

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <CustomTable columns={columns} loading={loading} emptyMessage="No payout records found.">
        {tableRows}
      </CustomTable>

      {/* Pagination Controls */}
      {filteredHistory.length > 0 && totalPages > 1 && (
        <div className="pagination-controls mt-4 d-flex justify-content-center align-items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CapitalPayoutHistory;