import React, { useState, useEffect } from 'react'
import SlideBarComponent from '../../components/SlideBar/SlideBarComponent'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTotalIncomeByEthnicity } from '../../service/statisticsservice'
import './IncomeEthnicity.scss'

const COLORS = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6610f2'];

const IncomeEthnicity = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTotalIncomeByEthnicity();
                // Chuyển đổi dữ liệu từ API để hiển thị
                const chartData = response.summary.map(item => ({
                    name: item.ethnicity || 'Khác', // Nếu ethnicity là null hoặc undefined thì hiển thị "Khác"
                    value: item.total_income
                })).sort((a, b) => b.value - a.value); // Sắp xếp theo thu nhập giảm dần

                setData(chartData);
            } catch (error) {
                console.error("Error fetching ethnicity income data:", error);
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
                <h3 className="mb-4">Thống Kê Thu Nhập Theo Dân Tộc</h3>

                <div className="row">
                    <div className="col-md-6">
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Dân tộc</th>
                                        <th>Thu nhập</th>
                                        <th>Tỷ lệ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => {
                                        const total = data.reduce((sum, curr) => sum + curr.value, 0);
                                        const percentage = ((item.value / total) * 100).toFixed(1);

                                        return (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(item.value)}</td>
                                                <td>{percentage}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
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
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(value)}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Thêm phần hiển thị chi tiết nếu cần */}
                {data.length > 0 && (
                    <div className="mt-4">
                        <h4>Tổng thu nhập: {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(data.reduce((sum, item) => sum + item.value, 0))}</h4>
                    </div>
                )}
            </div>
        </div>
    )
}

export default IncomeEthnicity