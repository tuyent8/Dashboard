import React from 'react'
import SlideBarComponent from '../../components/SlideBar/SlideBarComponent'
import './Homepage.scss'

const Homepage = () => {
    return (
        <div className="container">
            <div className="sidebar">
                <SlideBarComponent />
            </div>

            <div className="content">
                {/* Stat Cards */}
                <div className="top-stats">
                    <div className="stat-card">
                        <p className="stat-label">Growth</p>
                        <p className="stat-value">65%</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">New Users</p>
                        <p className="stat-value">15</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Profit</p>
                        <p className="stat-value">15,152</p>
                    </div>
                </div>

                <div className="bottom-section">
                    <div className="feature-grid">
                        <div className="feature-card">Messages</div>
                        <div className="feature-card">Clients</div>
                        <div className="feature-card">Expenses</div>
                        <div className="feature-card">Total Sales</div>
                        <div className="feature-card">Social Feed</div>
                        <div className="feature-card">Bounce Rate</div>
                    </div>

                    <div className="os-progress">
                        <div className="os-bar">
                            <span>Windows 8</span>
                            <div className="progress blue" style={{ width: '78%' }} />
                        </div>
                        <div className="os-bar">
                            <span>Mac</span>
                            <div className="progress green" style={{ width: '56%' }} />
                        </div>
                        <div className="os-bar">
                            <span>Linux</span>
                            <div className="progress orange" style={{ width: '44%' }} />
                        </div>
                        <div className="os-bar">
                            <span>iPhone</span>
                            <div className="progress red" style={{ width: '67%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage
