import React from 'react'
import SlideBarComponent from '../../components/SlideBar/SlideBarComponent'
import './Homepage.scss'
import EmployeeList from '../../components/EmployeeList/EmployeeList'
import { useEmployees } from '../../context/EmployeeContext'

const Homepage = () => {
    const { totalEmployees, loading } = useEmployees();

    return (
        <div className="container">
            <div className="sidebar">
                <SlideBarComponent />
            </div>

            <div className="content">
                <div className="top-stats">
                    <div className="stat-card">
                        <p className="stat-label">Growth</p>
                        <p className="stat-value">65%</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Tổng nhân viên</p>
                        <div className="stat-value-wrapper">
                            <p className="stat-value">{totalEmployees}</p>
                            {loading && (
                                <span className="spinner-border spinner-border-sm ms-2"
                                    role="status"
                                    aria-hidden="true" />
                            )}
                        </div>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Profit</p>
                        <p className="stat-value">15,152</p>
                    </div>
                </div>

                <EmployeeList />
            </div>
        </div>
    )
}

export default Homepage