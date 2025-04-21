import React, { useState } from "react";
import './HeaderComponent.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'font-awesome/css/font-awesome.min.css';

const Header = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleLogout = () => {
        // Logic đăng xuất
        alert("Đã đăng xuất!");
    };

    return (
        <div className="header">
            <div className="navbar">
                <span className="brand">Admin</span>
                <div className="nav-links">
                    <ul className="nav nav-icons">
                        <i className="bi bi-folder"></i>
                        <i className="bi bi-eye"></i>
                        <i className="bi bi-bar-chart"></i>
                    </ul>
                    <form className="search-container" action="#">
                        <input type="text" className="span3" placeholder="Search..." />
                        <button className="btn " type="button">
                            <i className="bi bi-search"></i>
                        </button>
                    </form>
                </div>

                <div className="navbar-right">
                    <span className="user-name">Welcome:</span>
                    <div className="user-avatar" onClick={toggleMenu}>
                        <i className="bi bi-person-circle"></i>
                        <i className="bi bi-chevron-down"></i> {/* Thêm mũi tên xuống */}
                        {showMenu && (
                            <div className="dropdown-menu">
                                <button onClick={handleLogout}>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
