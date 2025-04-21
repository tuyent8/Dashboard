import React from 'react';
import SlideBarComponent from '../../components/SlideBar/SlideBarComponent';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './VacationDayEmploymentType.scss';

const COLORS = {
    'Toàn thời gian': '#2196f3',  // Xanh dương
    'Bán thời gian': '#ff9800'    // Cam
};

const data = [
    { name: 'Toàn thời gian', value: 25 },
    { name: 'Bán thời gian', value: 10 },
];

const VacationDayEmploymentType = () => {
    return (
        <div className='container d-flex'>
            <div className='sidebar'>
                <SlideBarComponent />
            </div>

            <div className='content p-4 w-100'>
                <h3 className="mb-4">Thống kê Ngày Nghỉ - Loại Hình Làm Việc</h3>

                <div className="row">
                    <div className="col-md-6">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Loại hình</th>
                                    <th>Số ngày nghỉ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.value} ngày</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-md-6">
                        <h5 className="text-center mb-4" style={{ paddingBottom: '20px' }}>Biểu đồ Ngày Nghỉ</h5>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    fill="#8884d8"
                                    label
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value} ngày`, 'Số ngày nghỉ']}
                                    labelFormatter={(label) => `Loại hình: ${label}`}
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

export default VacationDayEmploymentType;
