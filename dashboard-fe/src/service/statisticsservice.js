import axios from "axios"
export const axiosJWT = axios.create()

export const getTotalIncomeByShareholder = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/income/shareholder`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getTotalIncomeByGender = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/income/gender`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getTotalIncomeByEthnicity = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/income/ethnicity`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getTotalIncomeByEmploymentType = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/income/employment-type`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getTotalIncomeByYear = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/income/year`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getTotalIncomeByDepartment = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/income/department`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getTotalVacationDaysByShareholder = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/vacation/shareholder`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getTotalVacationDaysByGender = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/vacation/gender`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getTotalVacationDaysByEthnicity = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/vacation/ethnicity`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getTotalVacationDaysByEmploymentType = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/vacation/employment-type`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getTotalVacationDaysByYear = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/vacation/year`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getAverageBenefitsByShareholder = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/benefits/shareholder`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
export const getAverageBenefitsByPlan = async () => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/benefits/plan`)
        return response.data
    } catch (error) {
        console.error("Error fetching statistics:", error)
        throw error
    }
}
