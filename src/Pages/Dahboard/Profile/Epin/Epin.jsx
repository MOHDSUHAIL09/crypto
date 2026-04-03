import React, { useState, useEffect } from 'react';
import CustomTable from '../../CustomTable/CustomTable';
import './Epin.css';

export const Epin = () => {
    const [loading, setLoading] = useState(false);
    const [epinData, setEpinData] = useState([]);
    const [totalEpin, setTotalEpin] = useState(0);

    // Columns for the table
    const columns = ['S. No.', 'E-Pin No.', 'E-Pin Name', 'User Id', 'Actions'];

    // Sample data - API se fetch karein
    useEffect(() => {
        fetchEpinData();
    }, []);

    const fetchEpinData = async () => {
        setLoading(true);
        try {
            // TODO: Apni API se data fetch karein
            // const response = await fetch(`${API_URL}/epin-list`);
            // const data = await response.json();

            // Sample data (API aane tak ke liye)
            setTimeout(() => {
                const sampleData = [
                    {
                        id: 1,
                        epinNo: 'EPIN123456789',
                        epinName: 'Premium Plan',
                        userId: 'INDIA001',
                    },
                ];
                setEpinData(sampleData);
                setTotalEpin(sampleData.length);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error fetching EPIN data:', error);
            setLoading(false);
        }
    };

    return (
        <div className="epin-container p-4 ">
            {/* Header Section */}

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
                <select className="epin-filter">
                    <option value="unused">Unused ePin</option>
                    <option value="used">Used ePin</option>
                </select>

            </div>


            <div className="epin-section">



                {/* Custom Table */}
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
                            <td className="actions-cell">
                                YES
                            </td>
                        </tr>
                    ))}
                </CustomTable>
            </div>
        </div>
    );
};