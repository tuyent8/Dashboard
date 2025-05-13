import React, { createContext, useState, useContext, useEffect } from 'react';
import { getEmployees } from '../service/Employeeservice';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshEmployees = async () => {
        try {
            setLoading(true);
            const response = await getEmployees();
            if (Array.isArray(response)) {
                setEmployees(response);
                setError(null);
            } else {
                setEmployees([]);
                setError(response?.message || 'Không thể tải danh sách nhân viên');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách nhân viên');
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshEmployees();
        const interval = setInterval(refreshEmployees, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <EmployeeContext.Provider value={{ employees, loading, error, refreshEmployees }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployees = () => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error('useEmployees must be used within an EmployeeProvider');
    }
    return context;
};