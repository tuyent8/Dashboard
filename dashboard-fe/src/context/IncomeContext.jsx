import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    getTotalIncomeByGender,
    getTotalIncomeByEthnicity,
    getTotalIncomeByShareholder,
    getTotalIncomeByEmploymentType,
    getTotalIncomeByDepartment
} from '../service/statisticsservice';

const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
    const [incomeData, setIncomeData] = useState({
        gender: [],
        ethnicity: [],
        shareholder: [],
        employmentType: [],
        department: []
    });
    const [loading, setLoading] = useState(true);

    const fetchIncomeData = async () => {
        try {
            const [
                genderData,
                ethnicityData,
                shareholderData,
                employmentTypeData,
                departmentData
            ] = await Promise.all([
                getTotalIncomeByGender(),
                getTotalIncomeByEthnicity(),
                getTotalIncomeByShareholder(),
                getTotalIncomeByEmploymentType(),
                getTotalIncomeByDepartment()
            ]);

            setIncomeData({
                gender: genderData.summary,
                ethnicity: ethnicityData.summary,
                shareholder: shareholderData.summary,
                employmentType: employmentTypeData.summary,
                department: departmentData.summary
            });
        } catch (error) {
            console.error("Error fetching income data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomeData();
        const interval = setInterval(fetchIncomeData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <IncomeContext.Provider value={{ incomeData, loading }}>
            {children}
        </IncomeContext.Provider>
    );
};

export const useIncome = () => useContext(IncomeContext);