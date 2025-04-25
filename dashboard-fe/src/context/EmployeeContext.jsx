import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAllEmployees } from '../service/statisticsservice';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEmployees = async () => {
        try {
            const response = await getAllEmployees();
            setEmployees(response);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
        const interval = setInterval(fetchEmployees, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <EmployeeContext.Provider value={{ employees, loading, totalEmployees: employees.length }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployees = () => useContext(EmployeeContext);