import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEmployee, getEmployees } from '../../service/Employeeservice';
import './EmployeeList.scss';

const EmployeeList = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const limit = 20;

    const fetchEmployees = async (page) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getEmployees(page, limit);
            if (response && response.success && response.data && Array.isArray(response.data.employees)) {
                setEmployees(response.data.employees);
                setTotalEmployees(response.data.total);
                setTotalPages(Math.ceil(response.data.total / limit));
                setError(null);
            } else {
                setEmployees([]);
                setTotalEmployees(0);
                setTotalPages(1);
                setError(response?.message || 'Không thể tải danh sách nhân viên');
            }
        } catch (err) {
            setEmployees([]);
            setTotalEmployees(0);
            setTotalPages(1);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách nhân viên');
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(currentPage);
    }, [currentPage]);

    const handleAddClick = () => {
        navigate('/employees/add');
    };

    const handleEdit = (employeeId) => {
        navigate(`/employees/edit/${employeeId}`);
    };

    const handleDelete = async (employeeId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            setDeleteLoading(true);
            setDeleteError(null);
            try {
                const response = await deleteEmployee(employeeId);
                if (response.success) {
                    // Refresh danh sách sau khi xóa thành công
                    await fetchEmployees(currentPage);
                } else {
                    setDeleteError(response.message || 'Không thể xóa nhân viên');
                }
            } catch (err) {
                setDeleteError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa nhân viên');
                console.error('Error deleting employee:', err);
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Tính toán range hiển thị
    const getPageRange = () => {
        const range = [];
        const maxPages = 5; // Số trang tối đa hiển thị
        let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
        let end = Math.min(totalPages, start + maxPages - 1);

        if (end - start + 1 < maxPages) {
            start = Math.max(1, end - maxPages + 1);
        }

        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    };

    return (
        <div className="employee-list-section mt-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh Sách Nhân Viên</h5>
                        <button className="btn btn-primary" onClick={handleAddClick}>
                            ➕ Thêm nhân viên
                        </button>
                    </div>

                    {/* Error messages */}
                    {error && employees.length === 0 && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Loading spinner */}
                    {(loading || deleteLoading) && (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                        </div>
                    )}

                    {/* Employee table */}
                    {!loading && (
                        <>
                            {employees && employees.length > 0 ? (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Mã NV</th>
                                                    <th>Họ và tên</th>
                                                    <th>Phòng ban</th>
                                                    <th>Giới tính</th>
                                                    <th>Cổ đông</th>
                                                    <th>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employees.map((emp) => (
                                                    <tr key={emp.employee_id || emp.id}>
                                                        <td>{emp.employee_id || emp.id}</td>
                                                        <td>{`${emp.first_name || ''} ${emp.last_name || ''}`}</td>
                                                        <td>{emp.department || 'N/A'}</td>
                                                        <td>{emp.gender === 1 ? 'Nam' : emp.gender === 0 ? 'Nữ' : 'N/A'}</td>
                                                        <td>{emp.shareholder_status ? 'Có' : 'Không'}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-warning me-2"
                                                                onClick={() => handleEdit(emp.employee_id || emp.id)}
                                                                disabled={deleteLoading}
                                                            >
                                                                Sửa
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDelete(emp.employee_id || emp.id)}
                                                                disabled={deleteLoading}
                                                            >
                                                                {deleteLoading ? 'Đang xóa...' : 'Xóa'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div>
                                            Hiển thị {employees.length} / {totalEmployees} nhân viên
                                        </div>
                                        <nav>
                                            <ul className="pagination justify-content-center mb-0">
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Trước
                                                    </button>
                                                </li>
                                                {getPageRange().map((pageNum) => (
                                                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(pageNum)}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    </li>
                                                ))}
                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        Sau
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </>
                            ) : error ? (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted mb-0">Không có nhân viên nào</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
