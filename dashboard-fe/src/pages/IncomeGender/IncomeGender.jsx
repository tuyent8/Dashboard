import React, { useState, useEffect } from 'react'
import SlideBarComponent from '../../components/SlideBar/SlideBarComponent'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTotalIncomeByGender } from '../../service/statisticsservice'
import './IncomeGender.scss'

const COLORS = ['#007bff', '#28a745'];

const IncomeGender = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTotalIncomeByGender();
                // Chuyển đổi dữ liệu từ API để hiển thị
                const chartData = response.summary.map(item => ({
                    name: item.gender === 'Male' ? 'Nam' :
                        item.gender === 'Female' ? 'Nữ' :
                            'Khác',
                    value: item.total_income
                })).sort((a, b) => a.name === 'Nam' ? -1 : 1); // Sắp xếp Nam trước Nữ

                setData(chartData);
            } catch (error) {
                console.error("Error fetching gender income data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className='container'>
                <div className='sidebar'>
                    <SlideBarComponent />
                </div>
                <div className='content w-100 d-flex justify-content-center align-items-center'>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='container'>
            <div className='sidebar'>
                <SlideBarComponent />
            </div>
            <div className='content w-100'>
                <h3 className="mb-4">Thống Kê Thu Nhập Theo Giới Tính</h3>

                <div className="row">
                    <div className="col-md-6">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Giới tính</th>
                                    <th>Thu nhập</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(item.value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-md-6">
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={130}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                                    labelLine
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IncomeGender