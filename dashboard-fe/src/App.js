import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../src/pages/Homepage/Homepage'; // Giả sử bạn có một trang homepage
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'; // Giả sử bạn có một trang NotFoundPage
import Headercomponent from './components/HeaderComponent/HeaderComponent'; // Giả sử bạn có một HeaderComponent
import IncomeSharehoder from './pages/IncomeSharehoder/IncomeSharehoder';
import IncomeGender from './pages/IncomeGender/IncomeGender';
import IncomeDepartment from './pages/IncomeDepartment/IncomeDepartment';
import IncomeEthnicity from './pages/IncomeEthnicity/IncomeEthnicity';
import VacationDaySharehoder from './pages/VacationDaySharehoder/VacationDaySharehoder';
import VacationDayGender from './pages/VacationDayGender/VacationDayGender';
import VacationDayEmploymentType from './pages/VacationDayEmploymentType/VacationDayEmploymentType';
import VacationDayEthnicity from './pages/VacationDayEthnicity/VacationDayEthnicity';
import IncomeEmploymentType from './pages/IncomeEmploymentType/IncomeEmploymentType';
import AddEmployee from './pages/AddEmployee/AddEmployee';
import EditEmployee from './pages/EditEmployee/EditEmployee';
function App() {
    return (
        <div>
            <Headercomponent />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/not-found" replace />} />
                <Route path="/income-sharehoder" element={<IncomeSharehoder />} />
                <Route path="/income-gender" element={<IncomeGender />} />
                <Route path="/income-department" element={<IncomeDepartment />} />
                <Route path="/income-employment-type" element={<IncomeEmploymentType />} />
                <Route path="/income-ethnicity" element={<IncomeEthnicity />} />
                <Route path="/vacationday-sharehoder" element={<VacationDaySharehoder />} />
                <Route path="/vacationday-gender" element={<VacationDayGender />} />
                <Route path="/vacationday-employment-type" element={<VacationDayEmploymentType />} />
                <Route path="/vacationday-ethnicity" element={<VacationDayEthnicity />} />
                <Route path="/employees/add" element={<AddEmployee />} />
                <Route path="/employees/edit/:id" element={<EditEmployee />} />
            </Routes>
        </div>
    );
}

export default App;
