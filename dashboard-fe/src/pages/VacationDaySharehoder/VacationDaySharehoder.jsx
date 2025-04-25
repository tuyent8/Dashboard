import React, { useState, useEffect } from 'react'
import SlideBarComponent from '../../components/SlideBar/SlideBarComponent';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './VacationDaySharehoder.scss';
import { getTotalVacationDaysByShareholder } from '../../service/statisticsservice';
import { useVacation } from '../../context/vacationContext';

const COLORS = ['#28a745', '#dc3545', '#ffc107']; // Màu xanh cho cổ đông, đỏ cho không phải cổ đông, vàng cho chưa xác định

const VacationDaySharehoder = () => {
    const { vacationData, loading } = useVacation();

    const data = vacationData.shareholder?.map(item => ({
        name: item.shareholder_status === 'Shareholder' ? 'Cổ đông' :
            item.shareholder_status === 'Non-Shareholder' ? 'Không là cổ đông' :
                'Chưa xác định',
        value: item.total_vacation_days
    })) || [];

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

    const totalVacationDays = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className='container'>
            <div className='sidebar'>
                <SlideBarComponent />
            </div>
            <div className='content w-100'>
                <h3 className="mb-4">Thống kê Ngày Nghỉ Theo Cổ Đông</h3>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <table className="table table-bordered table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Trạng thái</th>
                                            <th>Số ngày nghỉ</th>
                                            <th>Tỷ lệ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td className="text-end">{item.value} ngày</td>
                                                <td className="text-end">
                                                    {((item.value / totalVacationDays) * 100).toFixed(1)}%
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="table-info">
                                            <td><strong>Tổng cộng</strong></td>
                                            <td className="text-end"><strong>{totalVacationDays} ngày</strong></td>
                                            <td className="text-end"><strong>100%</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card shadow-sm">
                            <div className="card-body" style={{ height: '400px' }}>
                                <ResponsiveContainer width="100%" height="100%">
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
                                            formatter={(value) => `${value} ngày`}
                                            labelFormatter={(name) => `${name}`}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VacationDaySharehoder;