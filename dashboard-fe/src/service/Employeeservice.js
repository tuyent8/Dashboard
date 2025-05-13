import axios from "axios"
export const axiosJWT = axios.create()

export const createEmployee = async (data) => {
    try {
        const response = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/employee/create`, data)
        return response.data
    } catch (error) {
        console.error("Error creating employee:", error)
        throw error
    }
}

export const updateEmployee = async (id, data) => {
    try {
        const response = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/employee/update/${id}`, data)
        return response.data
    } catch (error) {
        console.error("Error updating employee:", error)
        throw error
    }
}

export const getEmployeeById = async (id) => {
    try {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/employee/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching employee:", error)
        throw error
    }
}

export const deleteEmployee = async (id) => {
    try {
        const response = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/employee/delete/${id}`)
        return response.data
    } catch (error) {
        console.error("Error deleting employee:", error)
        throw error
    }
}

export const getEmployees = async (page = null, limit = null) => {
    try {
        const params = {};
        if (page !== null && limit !== null) {
            params.page = page;
            params.limit = limit;
        }
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/statistics/employees`, {
            params: params
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
}