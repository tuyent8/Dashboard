// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { EmployeeProvider } from './context/EmployeeContext';
import { IncomeProvider } from './context/IncomeContext';
import { VacationProvider } from './context/vacationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <EmployeeProvider>
            <IncomeProvider>
                <VacationProvider>
                    <App />
                </VacationProvider>
            </IncomeProvider>
        </EmployeeProvider>
    </BrowserRouter>
);
