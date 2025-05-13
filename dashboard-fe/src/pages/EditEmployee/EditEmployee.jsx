import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateEmployee, getEmployeeById, deleteEmployee } from '../../service/Employeeservice';
import './EditEmployee.scss';
import SlideBarComponent from '../../components/SlideBar/SlideBarComponent';

const EditEmployee = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        // Personal Information (HR.dbo.Personal)
        employee_id: '', // This will be used as both Employee_ID in Personal and idEmployee in Employee
        first_name: '',
        last_name: '',
        middle_initial: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        email: '',
        phone_number: '',
        social_security_number: '', // This will be used as SSN in payroll.employee
        drivers_license: '',
        marital_status: '',
        gender: '',
        shareholder_status: false,
        benefit_plans: '',
        ethnicity: '',

        // Employee Information (payroll.employee)
        pay_rate: '',
        payrates_id: '',
        vacation_days: 0,
        paid_to_date: 0,
        paid_last_year: 0,
    });

    const fetchEmployeeData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getEmployeeById(id);
            if (response.success) {
                // Chuyển đổi gender từ số sang chữ cái
                const data = {
                    ...response.data,
                    gender: response.data.gender === 1 ? 'M' : response.data.gender === 0 ? 'F' : 'O'
                };
                setFormData(data);
            } else {
                setError('Failed to fetch employee data');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch employee data');
            console.error('Error fetching employee:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEmployeeData();
    }, [fetchEmployeeData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Convert numeric fields
            const dataToSend = {
                ...formData,
                gender: formData.gender === 'M' ? 1 : formData.gender === 'F' ? 0 : null,
                shareholder_status: formData.shareholder_status ? 1 : 0,
                benefit_plans: formData.benefit_plans ? Number(formData.benefit_plans) : null,
                pay_rate: formData.pay_rate ? Number(formData.pay_rate) : null,
                payrates_id: formData.payrates_id ? Number(formData.payrates_id) : null,
                vacation_days: formData.vacation_days ? Number(formData.vacation_days) : 0,
                paid_to_date: formData.paid_to_date ? Number(formData.paid_to_date) : 0,
                paid_last_year: formData.paid_last_year ? Number(formData.paid_last_year) : 0
            };

            const response = await updateEmployee(id, dataToSend);
            if (response.success) {
                navigate('/');
            } else {
                setError(response.message || 'Failed to update employee');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while updating employee');
            console.error('Error updating employee:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            setLoading(true);
            setError(null);

            try {
                const response = await deleteEmployee(id);
                if (response.success) {
                    navigate('/');
                } else {
                    setError(response.message || 'Failed to delete employee');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while deleting employee');
                console.error('Error deleting employee:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && !formData.employee_id) {
        return <div>Loading...</div>;
    }

    return (
        <div className="add-employee-page">
            <div className="sidebar">
                <SlideBarComponent />
            </div>
            <div className="add-employee-content">
                <div className="page-header">
                    <h1>Edit Employee</h1>
                </div>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <div className="card shadow-sm">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Personal Information */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Employee ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="employee_id"
                                            value={formData.employee_id}
                                            onChange={handleChange}
                                            required
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Middle Initial</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="middle_initial"
                                            value={formData.middle_initial}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Address Line 1</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="address1"
                                            value={formData.address1}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Address Line 2</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="address2"
                                            value={formData.address2}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">City</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">State</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="zip"
                                                    value={formData.zip}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact & Employment Information */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Social Security Number (SSN)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="social_security_number"
                                            value={formData.social_security_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Driver's License</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="drivers_license"
                                            value={formData.drivers_license}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Marital Status</label>
                                                <select
                                                    className="form-select"
                                                    name="marital_status"
                                                    value={formData.marital_status}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Married">Married</option>
                                                    <option value="Divorced">Divorced</option>
                                                    <option value="Widowed">Widowed</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Gender</label>
                                                <select
                                                    className="form-select"
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="M">Male</option>
                                                    <option value="F">Female</option>
                                                    <option value="O">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="shareholder_status"
                                                checked={formData.shareholder_status}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">Shareholder</label>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Benefit Plans</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="benefit_plans"
                                            value={formData.benefit_plans}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ethnicity</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="ethnicity"
                                            value={formData.ethnicity}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Employment Details */}
                                <div className="col-12 mt-4">
                                    <h6 className="section-title">Employment Details</h6>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Pay Rate</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="pay_rate"
                                                    value={formData.pay_rate}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Pay Rate ID</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="payrates_id"
                                                    value={formData.payrates_id}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Vacation Days</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="vacation_days"
                                                    value={formData.vacation_days}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Paid To Date</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="paid_to_date"
                                                    value={formData.paid_to_date}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Paid Last Year</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="paid_last_year"
                                                    value={formData.paid_last_year}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={loading}
                                >
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/employees')}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditEmployee; 