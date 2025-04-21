import React, { useState } from 'react';
import './SlideBarComponent.scss';
import { NavLink } from 'react-router-dom';

const SlideBarComponent = () => {
    const [incomeDropdownOpen, setIncomeDropdownOpen] = useState(false);
    const [leaveDropdownOpen, setLeaveDropdownOpen] = useState(false);
    const [benefitDropdownOpen, setBenefitDropdownOpen] = useState(false);

    const toggleIncomeDropdown = () => setIncomeDropdownOpen(!incomeDropdownOpen);
    const toggleLeaveDropdown = () => setLeaveDropdownOpen(!leaveDropdownOpen);
    const toggleBenefitDropdown = () => setBenefitDropdownOpen(!benefitDropdownOpen);

    return (
        <div className="sidebar">
            <div className="sidebar-menu">
                <div>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                        <i className="bi bi-house-door"></i> Dashboard
                    </NavLink>
                </div>

                <div>
                    <NavLink to="#" onClick={(e) => e.preventDefault()}>
                        <i className="bi bi-envelope"></i> Messages
                    </NavLink>
                </div>

                <div>
                    <a href="#" className="dropdown-toggle" onClick={toggleIncomeDropdown}>
                        <i className="bi bi-currency-dollar"></i> Tổng thu nhập
                        <i className={`bi bi-chevron-down dropdown-icon ${incomeDropdownOpen ? 'rotate' : ''}`}></i>
                    </a>
                    {incomeDropdownOpen && (
                        <ul className="submenu">
                            <li><NavLink to="/income-sharehoder" className={({ isActive }) => isActive ? 'active' : ''}>Theo cổ đông</NavLink></li>
                            <li><NavLink to="/income-gender" className={({ isActive }) => isActive ? 'active' : ''}>Theo giới tính</NavLink></li>
                            <li><NavLink to="/income-ethnicity" className={({ isActive }) => isActive ? 'active' : ''}>Theo sắc tộc</NavLink></li>
                            <li><NavLink to="/income-employment-type" className={({ isActive }) => isActive ? 'active' : ''}>Partime or FullTime</NavLink></li>
                            <li><NavLink to="/income-department" className={({ isActive }) => isActive ? 'active' : ''}>Theo phòng ban</NavLink></li>
                        </ul>
                    )}
                </div>

                <div>
                    <a href="#" className="dropdown-toggle" onClick={toggleLeaveDropdown}>
                        <i className="bi bi-calendar-check"></i> Tổng ngày nghỉ phép
                        <i className={`bi bi-chevron-down dropdown-icon ${leaveDropdownOpen ? 'rotate' : ''}`}></i>
                    </a>
                    {leaveDropdownOpen && (
                        <ul className="submenu">
                            <li><NavLink to="/vacationday-sharehoder" className={({ isActive }) => isActive ? 'active' : ''}>Theo cổ đông</NavLink></li>
                            <li><NavLink to="/vacationday-gender" className={({ isActive }) => isActive ? 'active' : ''}>Theo giới tính</NavLink></li>
                            <li><NavLink to="/vacationday-ethnicity" className={({ isActive }) => isActive ? 'active' : ''}>Theo sắc tộc</NavLink></li>
                            <li><NavLink to="/vacationday-employment-type" className={({ isActive }) => isActive ? 'active' : ''}>Partime or FullTime</NavLink></li>
                        </ul>
                    )}
                </div>

                <div>
                    <a href="#" className="dropdown-toggle" onClick={toggleBenefitDropdown}>
                        <i className="bi bi-gift"></i> Trung bình quyền lợi được chi trả
                        <i className={`bi bi-chevron-down dropdown-icon ${benefitDropdownOpen ? 'rotate' : ''}`}></i>
                    </a>
                    {benefitDropdownOpen && (
                        <ul className="submenu">
                            <li><NavLink to="/benefit-sharehoder" className={({ isActive }) => isActive ? 'active' : ''}>Theo cổ đông</NavLink></li>
                            <li><NavLink to="/benefit-plan" className={({ isActive }) => isActive ? 'active' : ''}>Theo gói quyền lợi</NavLink></li>
                        </ul>
                    )}
                </div>

                <div>
                    <NavLink to="/logout" className={({ isActive }) => isActive ? 'active' : ''}>
                        <i className="bi bi-box-arrow-right"></i> Logout
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default SlideBarComponent;
