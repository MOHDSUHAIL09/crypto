import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa'; 
import CustomTable from '../../CustomTable/CustomTable';
import apiClient from '../../../../api/apiClient';
import './Epin.css';

export const Epin = () => {
    const [loading, setLoading] = useState(false);
    const [epinData, setEpinData] = useState([]);
    const [totalEpin, setTotalEpin] = useState(0);
    const [epinType, setEpinType] = useState(1); 
    const [validUsers, setValidUsers] = useState({});
    const [validUserRegnos, setValidUserRegnos] = useState({});
    const [checkingUsers, setCheckingUsers] = useState({});
    const [inputValues, setInputValues] = useState({});

    const getColumns = () => {
        if (epinType === 0) {
            return ['S. No.', 'E-Pin No.', 'E-Pin Name', 'Action'];
        } else {
            return ['S. No.', 'E-Pin No.', 'E-Pin Name', 'User Id', 'Name'];
        }
    };

    const getRegNo = () => localStorage.getItem('regno');

    const fetchEpinData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/Dashboard/epin-list', {
                params: { RegNo: getRegNo(), EpinType: epinType }
            });
            if (response.data?.success && Array.isArray(response.data.data)) {
                const mappedData = response.data.data.map(item => ({
                    id: item.EpinId,
                    epinNo: item.EpinNumber,
                    epinName: item.SEName,
                    userId: item.kitCode || '',
                    memName: item.MemName || ''
                }));
                setEpinData(mappedData);
                setTotalEpin(mappedData.length);
            } else {
                setEpinData([]);
                setTotalEpin(0);
            }
        } catch (error) {
            console.error('Error fetching EPIN data:', error);
            setEpinData([]);
            setTotalEpin(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEpinData();
    }, [epinType]);

    const handleFilterChange = (e) => {
        setEpinType(e.target.value === 'unused' ? 0 : 1);
    };

    const validateUser = async (epinId, loginid) => {
        if (!loginid || loginid.trim() === '') {
            setValidUsers(prev => ({ ...prev, [epinId]: false }));
            setValidUserRegnos(prev => ({ ...prev, [epinId]: null }));
            return;
        }
        setCheckingUsers(prev => ({ ...prev, [epinId]: true }));
        try {
            const response = await apiClient.get('/User/check-user', {
                params: { loginid: loginid.trim() }
            });
            if (response.data?.success && response.data.data) {
                setValidUsers(prev => ({ ...prev, [epinId]: true }));
                const targetRegno = response.data.data.regno || response.data.data.RegNo;
                setValidUserRegnos(prev => ({ ...prev, [epinId]: targetRegno }));
            } else {
                setValidUsers(prev => ({ ...prev, [epinId]: false }));
                setValidUserRegnos(prev => ({ ...prev, [epinId]: null }));
            }
        } catch (error) {
            console.error('User validation error:', error);
            setValidUsers(prev => ({ ...prev, [epinId]: false }));
            setValidUserRegnos(prev => ({ ...prev, [epinId]: null }));
        } finally {
            setCheckingUsers(prev => ({ ...prev, [epinId]: false }));
        }
    };

    let debounceTimer;
    const onInputChange = (id, value) => {
        setInputValues(prev => ({ ...prev, [id]: value }));
        if (debounceTimer) clearTimeout(debounceTimer);
        setValidUsers(prev => ({ ...prev, [id]: false }));
        setValidUserRegnos(prev => ({ ...prev, [id]: null }));
        debounceTimer = setTimeout(() => {
            validateUser(id, value);
        }, 500);
    };

    const handleTransfer = async (epinNo, targetLoginId) => {
        const targetRegno = validUserRegnos[epinNo];
        if (!validUsers[epinNo] || !targetLoginId || !targetRegno) {
            alert('Please enter a valid User ID');
            return;
        }
        const payload = {
            regno: parseInt(getRegNo(), 10) || 0,
            rkprice: 0,
            uregno: targetRegno,
            pkg: "BOT",
            ist: new Date().toISOString(),
            aggrement: epinNo
        };
        try {
            const response = await apiClient.post('/Dashboard/activate-with-epin', payload);
            if (response.data?.success) {
                alert('EPIN transferred successfully!');
                await fetchEpinData();
                setInputValues(prev => ({ ...prev, [epinNo]: '' }));
                setValidUsers(prev => ({ ...prev, [epinNo]: false }));
                setValidUserRegnos(prev => ({ ...prev, [epinNo]: null }));
            } else {
                alert(response.data?.message || 'Activation failed. Please try again.');
            }
        } catch (error) {
            console.error('Error activating EPIN:', error);
            alert(error.response?.data?.message || 'An error occurred while activating EPIN.');
        }
    };

    return (
        <div className="epin-container p-4">
            <div className="d-flex justify-content-between mb-4 p-2">
                <div className="epin-header">
                    <h2 className="epin-title">List E-Pin</h2>
                    <div className="epin-stats d-flex">
                        <div className="stat-card1">
                            <span className="stat-label">Total E-Pin</span> &nbsp; &nbsp;
                            <span className="stat-value">{totalEpin}</span>
                        </div>
                    </div>
                </div>
                <select className="epin-filter" value={epinType === 0 ? 'unused' : 'used'} onChange={handleFilterChange}>
                    <option value="unused">Unused ePin</option>
                    <option value="used">Used ePin</option>
                </select>
            </div>

            <div className="epin-section">
                <CustomTable
                    columns={getColumns()}
                    loading={loading}
                    emptyMessage="No E-Pin Found"
                    loaderSize="md"
                    loaderText="Loading E-Pins..."
                >
                    {epinData.map((epin, index) => (
                        <tr key={epin.id} className="epin-row">
                            <td className="text-center">
                                <div className="sr-no-circle">{index + 1}</div>
                            </td>
                            <td>{epin.epinNo}</td>
                            <td>{epin.epinName}</td>
                            {epinType === 0 ? (
                                <td className="text-center">
                                    <div className="d-flex gap-2 align-items-center justify-content-center">
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="User ID / Login ID"
                                                style={{ width: '150px' }}
                                                value={inputValues[epin.id] || ''}
                                                onChange={(e) => onInputChange(epin.id, e.target.value)}
                                            />
                                            {validUsers[epin.id] && (
                                                <FaCheckCircle
                                                    style={{
                                                        position: 'absolute',
                                                        right: '8px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: '#28a745',
                                                        background: 'white',
                                                        borderRadius: '50%'
                                                    }}
                                                />
                                            )}
                                            {checkingUsers[epin.id] && (
                                                <div style={{
                                                    position: 'absolute',
                                                    right: '8px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid #ccc',
                                                    borderTopColor: '#667eea',
                                                    borderRadius: '50%',
                                                    animation: 'spin 0.6s linear infinite'
                                                }} />
                                            )}
                                        </div>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleTransfer(epin.epinNo, inputValues[epin.id])}
                                            disabled={!validUsers[epin.id] || !inputValues[epin.id]}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </td>
                            ) : (
                                <>
                                    <td>{epin.userId || '-'}</td>
                                    <td>{epin.memName || '-'}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </CustomTable>
            </div>

            {/* <style>{`
                @keyframes spin {
                    to { transform: translateY(-50%) rotate(360deg); }
                }
            `}</style> */}
        </div>
    );
};