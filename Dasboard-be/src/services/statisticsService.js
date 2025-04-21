const { createConnections } = require('../config/database');

class StatisticsService {
    constructor(dbHR, dbPayroll) {
        this.dbHR = dbHR;
        this.dbPayroll = dbPayroll;
    }

    // Income Statistics
    async getTotalIncomeByShareholder() {
        try {
            // 1. Get employee data with shareholder status from HR
            const hrQuery = `
                SELECT 
                    p.Employee_ID,
                    p.First_Name,
                    p.Last_Name,
                    p.Shareholder_Status
                FROM [HR].[dbo].[Personal] p
            `;
            const hrResult = await this.dbHR.query(hrQuery);

            // 2. Get salary information from Payroll
            const [payrollResult] = await this.dbPayroll.query(`
                SELECT 
                    e.idEmployee,
                    pr.Pay_Amount
                FROM employee e
                JOIN pay_rates pr ON e.PayRates_id = pr.idPay_Rates
            `);

            // 3. Combine and calculate results
            const summary = {};
            const details = {};

            hrResult.recordset.forEach(person => {
                let status;
                // Convert Shareholder_Status to number for comparison
                const shareholderStatus = Number(person.Shareholder_Status);
                if (shareholderStatus === 1) {
                    status = 'Shareholder';
                } else if (shareholderStatus === 0) {
                    status = 'Non-Shareholder';
                } else {
                    status = 'Unknown';
                }
                if (!summary[status]) {
                    summary[status] = 0;
                    details[status] = [];
                }

                const employeePayroll = payrollResult.find(p => p.idEmployee === person.Employee_ID);
                if (employeePayroll) {
                    const income = Number(employeePayroll.Pay_Amount) || 0;
                    summary[status] += income;
                    details[status].push({
                        employee_id: person.Employee_ID,
                        first_name: person.First_Name,
                        last_name: person.Last_Name,
                        income: income
                    });
                }
            });

            return {
                summary: Object.entries(summary).map(([status, total]) => ({
                    shareholder_status: status,
                    total_income: total
                })),
                details: details
            };
        } catch (error) {
            throw error;
        }
    }

    async getTotalIncomeByGender() {
        try {
            // 1. Get employee data with gender from HR
            const hrQuery = `
                SELECT 
                    p.Employee_ID,
                    p.First_Name,
                    p.Last_Name,
                    p.Gender
                FROM [HR].[dbo].[Personal] p
            `;
            const hrResult = await this.dbHR.query(hrQuery);

            // 2. Get salary information from Payroll
            const [payrollResult] = await this.dbPayroll.query(`
                SELECT 
                    e.idEmployee,
                    pr.Pay_Amount
                FROM employee e
                JOIN pay_rates pr ON e.PayRates_id = pr.idPay_Rates
            `);

            // 3. Combine and calculate results
            const summary = {};
            const details = {};

            hrResult.recordset.forEach(person => {
                let gender;
                // Convert Gender to number for comparison
                const genderValue = Number(person.Gender);
                if (genderValue === 0) {
                    gender = 'Male';
                } else if (genderValue === 1) {
                    gender = 'Female';
                } else {
                    gender = 'Unknown';
                }
                if (!summary[gender]) {
                    summary[gender] = 0;
                    details[gender] = [];
                }

                const employeePayroll = payrollResult.find(p => p.idEmployee === person.Employee_ID);
                if (employeePayroll) {
                    const income = Number(employeePayroll.Pay_Amount) || 0;
                    summary[gender] += income;
                    details[gender].push({
                        employee_id: person.Employee_ID,
                        first_name: person.First_Name,
                        last_name: person.Last_Name,
                        income: income
                    });
                }
            });

            return {
                summary: Object.entries(summary).map(([gender, total]) => ({
                    gender: gender,
                    total_income: total
                })),
                details: details
            };
        } catch (error) {
            throw error;
        }
    }

    async getTotalIncomeByEthnicity() {
        try {
            // 1. Get employee data with ethnicity from HR
            const hrQuery = `
                SELECT 
                    p.Employee_ID,
                    p.First_Name,
                    p.Last_Name,
                    p.Ethnicity
                FROM [HR].[dbo].[Personal] p
            `;
            const hrResult = await this.dbHR.query(hrQuery);

            // 2. Get salary information from Payroll
            const [payrollResult] = await this.dbPayroll.query(`
                SELECT 
                    e.idEmployee,
                    pr.Pay_Amount
                FROM employee e
                JOIN pay_rates pr ON e.PayRates_id = pr.idPay_Rates
            `);

            // 3. Combine and calculate results
            const summary = {};
            const details = {};

            hrResult.recordset.forEach(person => {
                const ethnicity = person.Ethnicity || 'Unknown';
                if (!summary[ethnicity]) {
                    summary[ethnicity] = 0;
                    details[ethnicity] = [];
                }

                const employeePayroll = payrollResult.find(p => p.idEmployee === person.Employee_ID);
                if (employeePayroll) {
                    const income = Number(employeePayroll.Pay_Amount) || 0;
                    summary[ethnicity] += income;
                    details[ethnicity].push({
                        employee_id: person.Employee_ID,
                        first_name: person.First_Name,
                        last_name: person.Last_Name,
                        income: income
                    });
                }
            });

            return {
                summary: Object.entries(summary).map(([ethnicity, total]) => ({
                    ethnicity: ethnicity,
                    total_income: total
                })),
                details: details
            };
        } catch (error) {
            throw error;
        }
    }

    async getTotalIncomeByEmploymentType() {
        try {
            // 1. Get employee data with employment type from HR
            const hrQuery = `
                SELECT 
                    j.Employee_ID,
                    p.First_Name,
                    p.Last_Name,
                    j.Hours_per_Week
                FROM [HR].[dbo].[Job_History] j
                JOIN [HR].[dbo].[Personal] p ON j.Employee_ID = p.Employee_ID
            `;
            const hrResult = await this.dbHR.query(hrQuery);

            // 2. Get salary information from Payroll
            const [payrollResult] = await this.dbPayroll.query(`
                SELECT 
                    e.idEmployee,
                    pr.Pay_Amount
                FROM employee e
                JOIN pay_rates pr ON e.PayRates_id = pr.idPay_Rates
            `);

            // 3. Combine and calculate results
            const summary = {
                'Full-time': 0,
                'Part-time': 0
            };
            const details = {
                'Full-time': [],
                'Part-time': []
            };

            hrResult.recordset.forEach(job => {
                const employmentType = job.Hours_per_Week < 40 ? 'Part-time' : 'Full-time';
                const employeePayroll = payrollResult.find(p => p.idEmployee === job.Employee_ID);
                if (employeePayroll) {
                    const income = Number(employeePayroll.Pay_Amount) || 0;
                    summary[employmentType] += income;
                    details[employmentType].push({
                        employee_id: job.Employee_ID,
                        first_name: job.First_Name,
                        last_name: job.Last_Name,
                        hours_per_week: job.Hours_per_Week,
                        income: income
                    });
                }
            });

            return {
                summary: Object.entries(summary).map(([type, total]) => ({
                    employment_type: type,
                    total_income: total
                })),
                details: details
            };
        } catch (error) {
            throw error;
        }
    }

    async getTotalIncomeByYear() {
        try {
            // Get employee data from HR database
            const hrResult = await this.dbHR.query(`
                SELECT 
                    Employee_ID,
                    First_Name,
                    Last_Name
                FROM [HR].[dbo].[Personal]
            `);
            const hrEmployees = hrResult.recordset || [];

            // Get salary information from Payroll database
            const [payrollEmployees] = await this.dbPayroll.query(`
                SELECT 
                    idEmployee,
                    Paid_To_Date,
                    Paid_Last_Year
                FROM employee
            `);

            // Calculate totals and prepare details
            const summary = {
                'Current Year': 0,
                'Last Year': 0
            };
            const details = {
                'Current Year': [],
                'Last Year': []
            };

            payrollEmployees.forEach(employee => {
                const currentYearIncome = Number(employee.Paid_To_Date) || 0;
                const lastYearIncome = Number(employee.Paid_Last_Year) || 0;

                summary['Current Year'] += currentYearIncome;
                summary['Last Year'] += lastYearIncome;

                // Find employee details from HR database
                const hrEmployee = hrEmployees.find(e => e.Employee_ID === employee.idEmployee);

                if (currentYearIncome > 0) {
                    details['Current Year'].push({
                        employee_id: employee.idEmployee,
                        first_name: hrEmployee ? hrEmployee.First_Name : null,
                        last_name: hrEmployee ? hrEmployee.Last_Name : null,
                        income: currentYearIncome
                    });
                }

                if (lastYearIncome > 0) {
                    details['Last Year'].push({
                        employee_id: employee.idEmployee,
                        first_name: hrEmployee ? hrEmployee.First_Name : null,
                        last_name: hrEmployee ? hrEmployee.Last_Name : null,
                        income: lastYearIncome
                    });
                }
            });

            return {
                summary: Object.entries(summary).map(([year, total]) => ({
                    year: year,
                    total_income: total
                })),
                details: details
            };
        } catch (error) {
            console.error('Error in getTotalIncomeByYear:', error);
            throw error;
        }
    }

    async getTotalIncomeByDepartment() {
        try {
            // 1. Get department data from HR
            const hrQuery = `
                SELECT 
                    j.Employee_ID,
                    p.First_Name,
                    p.Last_Name,
                    j.Department
                FROM [HR].[dbo].[Job_History] j
                JOIN [HR].[dbo].[Personal] p ON j.Employee_ID = p.Employee_ID
            `;
            const hrResult = await this.dbHR.query(hrQuery);

            // 2. Get salary information from Payroll
            const [payrollResult] = await this.dbPayroll.query(`
                SELECT 
                    e.idEmployee,
                    pr.Pay_Amount
                FROM employee e
                JOIN pay_rates pr ON e.PayRates_id = pr.idPay_Rates
            `);

            // 3. Combine and calculate results
            const summary = {};
            const details = {};

            hrResult.recordset.forEach(job => {
                const department = job.Department || 'Unknown';
                if (!summary[department]) {
                    summary[department] = 0;
                    details[department] = [];
                }

                const employeePayroll = payrollResult.find(p => p.idEmployee === job.Employee_ID);
                if (employeePayroll) {
                    const income = Number(employeePayroll.Pay_Amount) || 0;
                    summary[department] += income;
                    details[department].push({
                        employee_id: job.Employee_ID,
                        first_name: job.First_Name,
                        last_name: job.Last_Name,
                        income: income
                    });
                }
            });

            return {
                summary: Object.entries(summary).map(([department, total]) => ({
                    department: department,
                    total_income: total
                })),
                details: details
            };
        } catch (error) {
            throw error;
        }
    }

    // Vacation Statistics
    async getTotalVacationDaysByShareholder() {
        try {
            // 1. Get employee data with shareholder status from HR
            const hrQuery = `
                SELECT 
                    p.Employee_ID,
                    p.First_Name,
                    p.Last_Name,
                    p.Shareholder_Status
                FROM [HR].[dbo].[Personal] p
            `;
            const hrResult = await this.dbHR.query(hrQuery);

            // 2. Get vacation days from Payroll
            const [payrollResult] = await this.dbPayroll.query(`
                SELECT 
                    e.idEmployee,
                    e.Vacation_Days
                FROM employee e
            `);

            // 3. Combine and calculate results
            const summary = {};
            const details = {};

            hrResult.recordset.forEach(person => {
                let status;
                // Convert Shareholder_Status to number for comparison
                const shareholderStatus = Number(person.Shareholder_Status);
                if (shareholderStatus === 1) {
                    status = 'Shareholder';
                } else if (shareholderStatus === 0) {
                    status = 'Non-Shareholder';
                } else {
                    status = 'Unknown';
                }
                if (!summary[status]) {
                    summary[status] = 0;
                    details[status] = [];
                }

                const employeeVacation = payrollResult.find(p => p.idEmployee === person.Employee_ID);
                if (employeeVacation) {
                    const vacationDays = Number(employeeVacation.Vacation_Days) || 0;
                    summary[status] += vacationDays;
                    details[status].push({
                        employee_id: person.Employee_ID,
                        first_name: person.First_Name,
                        last_name: person.Last_Name,
                        vacation_days: vacationDays
                    });
                }
            });

            return {
                summary: Object.entries(summary).map(([status, total]) => ({
                    shareholder_status: status,
                    total_vacation_days: total
                })),
                details: details
            };
        } catch (error) {
            throw error;
        }
    }

    async getTotalVacationDaysByGender() {
        try {
            // 1. Get employee data with gender from HR
            const hrQuery = `
                SELECT 
                    p.Employee_ID,
                    p.First_Name,
                    p.Last_Name,
                    p.Gender
                FROM [HR].[dbo].[Personal] p
            `;
            const hrResult = await this.dbHR.query(hrQuery);

            // 2. Get vacation days from Payroll
            const [payrollResult] = await this.dbPayroll.query(`
                SELECT 
                    e.idEmployee,
                    e.Vacation_Days
                FROM employee e
            `);

            // 3. Combine and calculate results
            const summary = {};
            const details = {};

            hrResult.recordset.forEach(person => {
                let gender;
                // Convert Gender to number for comparison
                const genderValue = Number(person.Gender);
                if (genderValue === 0) {
                    gender = 'Male';
                } else if (genderValue === 1) {
                    gender = 'Female';
                } else {
                    gender = 'Unknown';
                }
                if (!summary[gender]) {
                    summary[gender] = 0;
                    details[gender] = [];
                }

                const employeeVacation = payrollResult.find(p => p.idEmployee === person.Employee_ID);
                if (employeeVacation) {
                    const vacationDays = Number(employeeVacation.Vacation_Days) || 0;
                    summary[gender] += vacationDays;
                    details[gender].push({
                        employee_id: person.Employee_ID,
                        first_name: person.First_Name,
                        last_name: person.Last_Name,
                        vacation_days: vacationDays
                    });
                }
            });

            return {
                summary: Object.entries(summary).map(([gender, total]) => ({
                    gender: gender,
                    total_vacation_days: total
                })),
                details: details
            };
        } catch (error) {
            throw error;
        }
    }

    async getTotalVacationDaysByEthnicity() {
        try {
            // 1. Get employee data with ethnicity from HR
            const hrQuery = `
                SELECT 
                    p.Employee_ID,
                    p.First_Name,
                    p.Last_Name,
                    p.Ethnicity
                FROM [HR].[dbo].[Personal] p
            `;
            const hrResult = await this.dbHR.query(hrQuery);

            // 2. Get vacation days from Payroll
            const [payrollResult] = await this.dbPayroll.query(`
                SELECT 
                    e.idEmployee,
                    e.Vacation_Days
                FROM employee e
            `);

            // 3. Combine and calculate results
            const summary = {};
            const details = {};

            hrResult.recordset.forEach(person => {
                const ethnicity = person.Ethnicity || 'Unknown';
                if (!summary[ethnicity]) {
                    summary[ethnicity] = 0;
                    details[ethnicity] = [];
                }

                const employeeVacation = payrollResult.find(p => p.idEmployee === person.Employee_ID);
                if (employeeVacation) {
                    const vacationDays = Number(employeeVacation.Vacation_Days) || 0;
                    summary[ethnicity] += vacationDays;
                    details[ethnicity].push({
                        employee_id: person.Employee_ID,
                        first_name: person.First_Name,
                        last_name: person.Last_Name,
                        vacation_days: vacationDays
                    });
                }
            });

            return {
                summary: Object.entries(summary).map(([ethnicity, total]) => ({
                    ethnicity: ethnicity,
                    total_vacation_days: total
                })),
                details: details
            };
        } catch (error) {
            throw error;
        }
    }

    async getTotalVacationDaysByEmploymentType() {
        try {
            // 1. Get employee data with employment type from HR
            const hrQuery = `
                SELECT 
                    j.Employee_ID,
                    p.First_Name,
                    p.Last_Name,
                    j.Hours_per_Week
                FROM [HR].[dbo].[Job_History] j
                JOIN [HR].[dbo].[Personal] p ON j.Employee_ID = p.Employee_ID
            `;
            const hrResult = await this.dbHR.query(hrQuery);

            // 2. Get vacation days from Payroll
            const [payrollResult] = await this.dbPayroll.query(`
                SELECT 
                    e.idEmployee,
                    e.Vacation_Days
                FROM employee e
            `);

            // 3. Combine and calculate results
            const summary = {
                'Full-time': 0,
                'Part-time': 0
            };
            const details = {
                'Full-time': [],
                'Part-time': []
            };

            hrResult.recordset.forEach(job => {
                const employmentType = job.Hours_per_Week < 40 ? 'Part-time' : 'Full-time';
                const employeeVacation = payrollResult.find(p => p.idEmployee === job.Employee_ID);
                if (employeeVacation) {
                    const vacationDays = Number(employeeVacation.Vacation_Days) || 0;
                    summary[employmentType] += vacationDays;
                    details[employmentType].push({
                        employee_id: job.Employee_ID,
                        first_name: job.First_Name,
                        last_name: job.Last_Name,
                        hours_per_week: job.Hours_per_Week,
                        vacation_days: vacationDays
                    });
                }
            });

            return {
                summary: Object.entries(summary).map(([type, total]) => ({
                    employment_type: type,
                    total_vacation_days: total
                })),
                details: details
            };
        } catch (error) {
            throw error;
        }
    }

    async getTotalVacationDaysByYear() {
        try {
            const [result] = await this.dbPayroll.query(`
                SELECT 
                    CASE 
                        WHEN Paid_To_Date > 0 THEN 'Current Year'
                        WHEN Paid_Last_Year > 0 THEN 'Last Year'
                        ELSE 'Unknown'
                    END as year_type,
                    SUM(Vacation_Days) as total_vacation_days
                FROM employee
                GROUP BY CASE 
                    WHEN Paid_To_Date > 0 THEN 'Current Year'
                    WHEN Paid_Last_Year > 0 THEN 'Last Year'
                    ELSE 'Unknown'
                END
            `);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Benefits Statistics
    async getAverageBenefitsByShareholder() {
        const result = await this.dbHR.query(`
            SELECT 
                p.Shareholder_Status,
                AVG(bp.Deductable) as average_deductable,
                AVG(bp.Percentage_CoPay) as average_copay
            FROM [HR].[dbo].[Personal] p
            JOIN [HR].[dbo].[Benefit_Plans] bp ON p.Benefit_Plans = bp.Benefit_Plan_ID
            GROUP BY p.Shareholder_Status
        `);
        return result[0];
    }

    async getAverageBenefitsByPlan() {
        const result = await this.dbHR.query(`
            SELECT 
                bp.Plan_Name,
                AVG(bp.Deductable) as average_deductable,
                AVG(bp.Percentage_CoPay) as average_copay
            FROM [HR].[dbo].[Benefit_Plans] bp
            GROUP BY bp.Plan_Name
        `);
        return result[0];
    }

    // Get all employees from both databases
    async getAllEmployees() {
        try {
            // Get all employees from HR database
            const hrResult = await this.dbHR.query(`
                SELECT 
                    p.Employee_ID,
                    p.First_Name,
                    p.Last_Name,
                    p.Gender,
                    p.Shareholder_Status,
                    p.Ethnicity,
                    j.Department,
                    j.Hours_per_Week,
                    bp.Plan_Name,
                    bp.Deductable,
                    bp.Percentage_CoPay
                FROM [HR].[dbo].[Personal] p
                LEFT JOIN [HR].[dbo].[Job_History] j ON p.Employee_ID = j.Employee_ID
                LEFT JOIN [HR].[dbo].[Benefit_Plans] bp ON p.Benefit_Plans = bp.Benefit_Plan_ID
            `);

            // Get all employees from Payroll database
            const [payrollEmployees] = await this.dbPayroll.query(`
                SELECT 
                    e.idEmployee,
                    e.First_Name,
                    e.Last_Name,
                    e.Vacation_Days,
                    e.Paid_To_Date,
                    e.Paid_Last_Year,
                    pr.Pay_Amount,
                    e.PayRates_id
                FROM employee e
                LEFT JOIN pay_rates pr ON e.PayRates_id = pr.idPay_Rates
            `);

            // Convert HR result to array if it's not
            const hrEmployees = Array.isArray(hrResult.recordset) ? hrResult.recordset : [];

            console.log('Raw HR Employees:', hrEmployees.length);
            console.log('Raw Payroll Employees:', payrollEmployees.length);

            // Create maps for quick lookup and collect all unique IDs
            const hrMap = new Map();
            const payrollMap = new Map();
            const allIds = new Set();

            // Process HR employees first
            hrEmployees.forEach(emp => {
                const id = Number(emp.Employee_ID);
                hrMap.set(id, emp);
                allIds.add(id);
                console.log('Adding HR ID:', id);
            });

            // Process Payroll employees
            payrollEmployees.forEach(emp => {
                const id = Number(emp.idEmployee);
                payrollMap.set(id, emp);
                allIds.add(id);
                console.log('Adding Payroll ID:', id);
            });

            console.log('HR Map size:', hrMap.size);
            console.log('Payroll Map size:', payrollMap.size);
            console.log('Total unique IDs:', allIds.size);

            // Sort IDs for consistent order
            const sortedIds = Array.from(allIds).sort((a, b) => a - b);
            console.log('All IDs:', sortedIds);

            // Combine data for all employees
            const result = sortedIds.map(id => {
                const hrData = hrMap.get(id);
                const payrollData = payrollMap.get(id);

                console.log(`Processing ID ${id}:`, {
                    hasHRData: !!hrData,
                    hasPayrollData: !!payrollData,
                    source: hrData && payrollData ? 'Both' : hrData ? 'HR Only' : 'Payroll Only'
                });

                // Create employee object with data from both sources
                const employee = {
                    employee_id: id,
                    // Personal Information (prioritize HR data)
                    first_name: hrData?.First_Name || payrollData?.First_Name || null,
                    last_name: hrData?.Last_Name || payrollData?.Last_Name || null,
                    gender: hrData?.Gender || null,
                    ethnicity: hrData?.Ethnicity || null,

                    // HR Information
                    shareholder_status: hrData?.Shareholder_Status || null,
                    department: hrData?.Department || null,
                    employment_type: hrData?.Hours_per_Week ?
                        (hrData.Hours_per_Week < 40 ? 'Part-time' : 'Full-time') : null,

                    // Benefits Information
                    benefit_plan: hrData?.Plan_Name || null,
                    deductable: hrData?.Deductable || null,
                    copay_percentage: hrData?.Percentage_CoPay || null,

                    // Payroll Information - always null if no payroll data
                    vacation_days: payrollData ? payrollData.Vacation_Days || null : null,
                    current_year_paid: payrollData ? payrollData.Paid_To_Date || null : null,
                    last_year_paid: payrollData ? payrollData.Paid_Last_Year || null : null,
                    pay_amount: payrollData ? payrollData.Pay_Amount || null : null,
                    payrates_id: payrollData ? payrollData.PayRates_id || null : null,

                    // Source Information
                    data_source: hrData && payrollData ? 'Both' :
                        hrData ? 'HR Only' :
                            payrollData ? 'Payroll Only' : 'Unknown'
                };

                return employee;
            });

            console.log('Final result length:', result.length);
            return result;
        } catch (error) {
            console.error('Error in getAllEmployees:', error);
            throw error;
        }
    }

    async getTotalEmployees() {
        try {
            // Get all unique employee IDs from both databases
            const [hrResult] = await this.dbHR.query(`
                SELECT DISTINCT Employee_ID
                FROM [HR].[dbo].[Personal]
            `);

            const [payrollResult] = await this.dbPayroll.query(`
                SELECT DISTINCT idEmployee
                FROM employee
            `);

            // Create a Set to store unique employee IDs
            const uniqueEmployeeIds = new Set();

            // Add IDs from HR database
            hrResult.forEach(employee => {
                uniqueEmployeeIds.add(employee.Employee_ID);
            });

            // Add IDs from Payroll database
            payrollResult.forEach(employee => {
                uniqueEmployeeIds.add(employee.idEmployee);
            });

            return {
                total_unique_employees: uniqueEmployeeIds.size,
                hr_employees: hrResult.length,
                payroll_employees: payrollResult.length
            };
        } catch (error) {
            throw error;
        }
    }
}

// Export a factory function to create service instance
module.exports = (dbHR, dbPayroll) => new StatisticsService(dbHR, dbPayroll); 