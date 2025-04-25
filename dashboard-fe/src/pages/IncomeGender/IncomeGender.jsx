import React, { useState, useEffect } from 'react'
import SlideBarComponent from '../../components/SlideBar/SlideBarComponent'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './IncomeGender.scss'
import { useIncome } from '../../context/IncomeContext';

const COLORS = ['#007bff', '#28a745'];

const IncomeGender = () => {
    const { incomeData, loading } = useIncome();

    // Lấy và xử lý dữ liệu từ context
    const data = incomeData.gender?.map(item => ({
        name: item.gender === 'Male' ? 'Nam' :
            item.gender === 'Female' ? 'Nữ' :
                'Khác',
        value: item.total_income
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

    const totalIncome = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className='container'>
            <div className='sidebar'>
                <SlideBarComponent />
            </div>
            <div className='content w-100'>
                <h3 className="mb-4">Thống Kê Thu Nhập Theo Giới Tính</h3>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <table className="table table-bordered table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Giới tính</th>
                                            <th>Thu nhập</th>
                                            <th>Tỷ lệ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td className="text-end">{new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(item.value)}</td>
                                                <td className="text-end">
                                                    {((item.value / totalIncome) * 100).toFixed(1)}%
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="table-info">
                                            <td><strong>Tổng cộng</strong></td>
                                            <td className="text-end"><strong>{new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(totalIncome)}</strong></td>
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
            </div>
        </div>
    )
}

export default IncomeGender