import React, { useState, useEffect } from 'react';
import CustomTable from '../../CustomTable/CustomTable';
import apiClient from '../../../../api/apiClient';
import './Epin.css';

export const Epin = () => {
    const [loading, setLoading] = useState(false);
    const [epinData, setEpinData] = useState([]);
    const [totalEpin, setTotalEpin] = useState(0);

    // Filter state: 0 = unused, 1 = used (as per API)
    const [epinType, setEpinType] = useState(1); // default: used

    const columns = ['S. No.', 'E-Pin No.', 'E-Pin Name', 'User Id', 'Actions'];

    // Get RegNo from localStorage (adjust key as per your app)
    const getRegNo = () => {
        return localStorage.getItem('RegNo') || 1;
    };

    const fetchEpinData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/Dashboard/epin-list', {
                params: {
                    RegNo: getRegNo(),
                    EpinType: epinType,  // 0 = unused, 1 = used
                }
            });

            if (response.data?.success && Array.isArray(response.data.data)) {
                const mappedData = response.data.data.map(item => ({
                    id: item.EpinId,
                    epinNo: item.EpinNumber,
                    epinName: item.kitCode || item.SEName || 'E-Pin',
                    userId: item.memcodeA || item.RegNo,
                    eActive: item.eActive
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

    // Refetch when filter changes
    useEffect(() => {
        fetchEpinData();
    }, [epinType]);

    // Handle dropdown change
    const handleFilterChange = (e) => {
        const value = e.target.value;
        if (value === 'unused') {
            setEpinType(0);
        } else if (value === 'used') {
            setEpinType(1);
        }
    };

    return (
        <div className="epin-container p-4 ">
            <div className='d-flex justify-content-between mb-4 p-2'>
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
                    columns={columns}
                    loading={loading}
                    emptyMessage="No E-Pin Found"
                    loaderSize="md"
                    loaderText="Loading E-Pins..."
                >
                    {epinData.map((epin, index) => (
                        <tr key={epin.id} className="epin-row">
                            <td>{index + 1}</td>
                            <td className="epin-number">{epin.epinNo}</td>
                            <td>{epin.epinName}</td>
                            <td>{epin.userId}</td>
                            <td className="actions-cell">YES</td>
                        </tr>
                    ))}
                </CustomTable>
            </div>
        </div>
    );
};