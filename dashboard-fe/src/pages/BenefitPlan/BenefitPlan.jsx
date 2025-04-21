import React, { useState, useEffect } from 'react';
import SlideBarComponent from '../../components/SlideBar/SlideBarComponent';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTotalIncomeByGender } from '../../service/statisticsservice';
import './BenefitPlan.scss';

const COLORS = {
    'Nam': '#4caf50',  // Green
    'Nữ': '#f44336'    // Red
};

const BenefitPlan = () => {
    const [genderData, setGenderData] = useState([]);

    useEffect(() => {
        // Fetching data from the service (assuming it's available)
        const fetchGenderData = async () => {
            const response = await getTotalIncomeByGender();
            setGenderData(response.data); // Assuming response has a 'data' key
        };

        fetchGenderData();
    }, []);

    return (
        <div className='container d-flex'>
            <div className='sidebar'>
                <SlideBarComponent />
            </div>

            <div className='content p-4 w-100'>
                <h3 className="mb-4">Kế hoạch Phúc lợi - Giới tính</h3>

                <div className="row">
                    <div className="col-md-6">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Giới tính</th>
                                    <th>Số phúc lợi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {genderData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.value} phúc lợi</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-md-6">
                        <h5 className="text-center mb-4" style={{ paddingBottom: '20px' }}>Biểu đồ Phúc lợi</h5>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    fill="#8884d8"
                                    label
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value} phúc lợi`, 'Số phúc lợi']}
                                    labelFormatter={(label) => `Giới tính: ${label}`}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BenefitPlan;
