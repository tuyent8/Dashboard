import React from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import './EmployeeList.scss';

const EmployeeList = ({ onAdd, onEdit, onDelete }) => {
    const { employees, loading } = useEmployees();

    if (loading && employees.length === 0) {
        return (
            <div className="employee-list-section">
                <div className="card shadow-sm">
                    <div className="card-body text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="employee-list-section">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh Sách Nhân Viên</h5>
                        <div className="d-flex align-items-center gap-2">
                            {loading && (
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Đang cập nhật...</span>
                                </div>
                            )}
                            <button className="btn btn-sm btn-primary" onClick={onAdd}>
                                ➕ Thêm nhân viên
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Mã NV</th>
                                    <th>Họ và tên</th>
                                    <th>Phòng ban</th>
                                    <th>Loại hình</th>
                                    <th>Lương</th>
                                    <th>Ngày nghỉ</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.employee_id}>
                                        <td>{emp.employee_id}</td>
                                        <td>{`${emp.first_name} ${emp.last_name}`}</td>
                                        <td>{emp.department || 'N/A'}</td>
                                        <td>{emp.employment_type === 'Full-time' ? 'Toàn thời gian' : 'Bán thời gian'}</td>
                                        <td className="text-end">
                                            {emp.pay_amount
                                                ? new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(emp.pay_amount)
                                                : 'N/A'}
                                        </td>
                                        <td className="text-end">{emp.vacation_days ?? 'N/A'}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => onEdit(emp)}
                                            >
                                                ✏️ Sửa
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => onDelete(emp.employee_id)}
                                            >
                                                🗑️ Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
