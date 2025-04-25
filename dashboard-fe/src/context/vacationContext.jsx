import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    getTotalVacationDaysByGender,
    getTotalVacationDaysByEthnicity,
    getTotalVacationDaysByShareholder,
    getTotalVacationDaysByEmploymentType
} from '../service/statisticsservice';

const VacationContext = createContext();

export const VacationProvider = ({ children }) => {
    const [vacationData, setVacationData] = useState({
        gender: [],
        ethnicity: [],
        shareholder: [],
        employmentType: []
    });
    const [loading, setLoading] = useState(true);

    const fetchVacationData = async () => {
        try {
            const [
                genderData,
                ethnicityData,
                shareholderData,
                employmentTypeData
            ] = await Promise.all([
                getTotalVacationDaysByGender(),
                getTotalVacationDaysByEthnicity(),
                getTotalVacationDaysByShareholder(),
                getTotalVacationDaysByEmploymentType()
            ]);

            setVacationData({
                gender: genderData.summary,
                ethnicity: ethnicityData.summary,
                shareholder: shareholderData.summary,
                employmentType: employmentTypeData.summary
            });
        } catch (error) {
            console.error("Error fetching vacation data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVacationData();
        const interval = setInterval(fetchVacationData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <VacationContext.Provider value={{ vacationData, loading }}>
            {children}
        </VacationContext.Provider>
    );
};

export const useVacation = () => useContext(VacationContext);