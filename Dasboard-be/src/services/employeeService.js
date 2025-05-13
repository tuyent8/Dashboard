const sql = require('mssql/msnodesqlv8');

class EmployeeService {
    constructor(dbHR, dbPayroll) {
        this.dbHR = dbHR;
        this.dbPayroll = dbPayroll;
    }

    // Transform frontend data to database format
    transformEmployeeData(employeeData) {
        // Common fields that exist in both databases
        const commonFields = {
            id: employeeData.employee_id,
            firstName: employeeData.first_name,
            lastName: employeeData.last_name,
            ssn: employeeData.social_security_number
        };

        // Helper ép kiểu số an toàn
        const safeNumber = (val, def = null) => {
            const n = Number(val);
            return isNaN(n) ? def : n;
        };

        // HR.dbo.Personal specific fields
        const personalFields = {
            Employee_ID: safeNumber(employeeData.employee_id),
            First_Name: employeeData.first_name,
            Last_Name: employeeData.last_name,
            Middle_Initial: employeeData.middle_initial || null,
            Address1: employeeData.address1 || null,
            Address2: employeeData.address2 || null,
            City: employeeData.city || null,
            State: employeeData.state || null,
            ZIP: safeNumber(employeeData.zip),
            Email: employeeData.email || null,
            Phone_Number: employeeData.phone_number || null,
            Social_Security_Number: employeeData.social_security_number,
            Drivers_License: employeeData.drivers_license || null,
            Marital_Status: employeeData.marital_status || null,
            Gender: employeeData.gender === 1 || employeeData.gender === '1' ? 1 : 0,
            Shareholder_Status: employeeData.shareholder_status === 1 || employeeData.shareholder_status === '1' ? 1 : 0,
            Benefit_Plans: safeNumber(employeeData.benefit_plans),
            Ethnicity: employeeData.ethnicity || null
        };

        // payroll.employee specific fields
        const employeeFields = {
            Employee_Number: safeNumber(employeeData.employee_id),
            idEmployee: safeNumber(employeeData.employee_id),
            First_Name: employeeData.first_name,
            Last_Name: employeeData.last_name,
            SSN: safeNumber(employeeData.social_security_number),
            Pay_Rate: safeNumber(employeeData.pay_rate, 0),
            PayRates_id: safeNumber(employeeData.payrates_id),
            Vacation_Days: safeNumber(employeeData.vacation_days, 0),
            Paid_To_Date: safeNumber(employeeData.paid_to_date, 0),
            Paid_Last_Year: safeNumber(employeeData.paid_last_year, 0)
        };

        return {
            personal: personalFields,
            employee: employeeFields
        };
    }

    async createEmployee(employeeData) {
        try {
            const transformedData = this.transformEmployeeData(employeeData);
            await this.insertIntoBothDatabases(transformedData);
            return {
                employee_id: employeeData.employee_id,
                message: 'Employee created successfully'
            };
        } catch (error) {
            // Kiểm tra lỗi trùng ID (tùy vào DBMS, ví dụ với SQL Server hoặc MySQL)
            if (error.message && (error.message.includes('duplicate') || error.message.includes('PRIMARY KEY'))) {
                throw new Error('ID đã tồn tại');
            }
            throw new Error(`Failed to create employee: ${error.message}`);
        }
    }

    async insertIntoBothDatabases(transformedData) {
        let insertedHR = false;
        let payrollConnection;
        try {
            // Insert vào HR.dbo.Personal (SQL Server)
            const personalQuery = `
                INSERT INTO [HR].[dbo].[Personal] (
                    Employee_ID, First_Name, Last_Name, Middle_Initial,
                    Address1, Address2, City, State, ZIP,
                    Email, Phone_Number, Social_Security_Number,
                    Drivers_License, Marital_Status, Gender,
                    Shareholder_Status, Benefit_Plans, Ethnicity
                ) VALUES (
                    @Employee_ID, @First_Name, @Last_Name, @Middle_Initial,
                    @Address1, @Address2, @City, @State, @ZIP,
                    @Email, @Phone_Number, @Social_Security_Number,
                    @Drivers_License, @Marital_Status, @Gender,
                    @Shareholder_Status, @Benefit_Plans, @Ethnicity
                )
            `;

            const request = new sql.Request();
            request.input('Employee_ID', transformedData.personal.Employee_ID);
            request.input('First_Name', transformedData.personal.First_Name);
            request.input('Last_Name', transformedData.personal.Last_Name);
            request.input('Middle_Initial', transformedData.personal.Middle_Initial);
            request.input('Address1', transformedData.personal.Address1);
            request.input('Address2', transformedData.personal.Address2);
            request.input('City', transformedData.personal.City);
            request.input('State', transformedData.personal.State);
            request.input('ZIP', transformedData.personal.ZIP);
            request.input('Email', transformedData.personal.Email);
            request.input('Phone_Number', transformedData.personal.Phone_Number);
            request.input('Social_Security_Number', transformedData.personal.Social_Security_Number);
            request.input('Drivers_License', transformedData.personal.Drivers_License);
            request.input('Marital_Status', transformedData.personal.Marital_Status);
            request.input('Gender', transformedData.personal.Gender);
            request.input('Shareholder_Status', transformedData.personal.Shareholder_Status);
            request.input('Benefit_Plans', transformedData.personal.Benefit_Plans);
            request.input('Ethnicity', transformedData.personal.Ethnicity);

            await request.query(personalQuery);
            insertedHR = true;

            // Insert vào payroll.employee (MySQL)
            const employeeQuery = `
                INSERT INTO employee (
                    Employee_Number, idEmployee, First_Name, Last_Name, SSN,
                    Pay_Rate, PayRates_id, Vacation_Days,
                    Paid_To_Date, Paid_Last_Year
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            payrollConnection = await this.dbPayroll.getConnection();
            await payrollConnection.query(employeeQuery, [
                transformedData.employee.Employee_Number,
                transformedData.employee.idEmployee,
                transformedData.employee.First_Name,
                transformedData.employee.Last_Name,
                transformedData.employee.SSN,
                transformedData.employee.Pay_Rate,
                transformedData.employee.PayRates_id,
                transformedData.employee.Vacation_Days,
                transformedData.employee.Paid_To_Date,
                transformedData.employee.Paid_Last_Year
            ]);
        } catch (error) {
            // Nếu đã insert HR nhưng Payroll lỗi, rollback HR
            if (insertedHR) {
                try {
                    const deleteQuery = `DELETE FROM [HR].[dbo].[Personal] WHERE Employee_ID = @Employee_ID`;
                    const delRequest = new sql.Request();
                    delRequest.input('Employee_ID', transformedData.personal.Employee_ID);
                    await delRequest.query(deleteQuery);
                } catch (rollbackError) {
                    console.error('Rollback HR failed:', rollbackError);
                }
            }
            throw error;
        } finally {
            if (payrollConnection) payrollConnection.release();
        }
    }

    async getEmployeeById(id) {
        try {
            // Get employee data from both databases
            const hrQuery = `
                SELECT *
                FROM [HR].[dbo].[Personal]
                WHERE Employee_ID = @id
            `;

            const payrollQuery = `
                SELECT *
                FROM employee
                WHERE idEmployee = ?
            `;

            const request = new sql.Request();
            request.input('id', id);

            const [hrResult, payrollResult] = await Promise.all([
                request.query(hrQuery),
                this.dbPayroll.query(payrollQuery, [id])
            ]);

            if (!hrResult.recordset[0] || !payrollResult[0]) {
                throw new Error('Employee not found');
            }

            // Combine data from both databases
            const employee = {
                employee_id: hrResult.recordset[0].Employee_ID,
                first_name: hrResult.recordset[0].First_Name,
                last_name: hrResult.recordset[0].Last_Name,
                middle_initial: hrResult.recordset[0].Middle_Initial,
                address1: hrResult.recordset[0].Address1,
                address2: hrResult.recordset[0].Address2,
                city: hrResult.recordset[0].City,
                state: hrResult.recordset[0].State,
                zip: hrResult.recordset[0].ZIP,
                email: hrResult.recordset[0].Email,
                phone_number: hrResult.recordset[0].Phone_Number,
                social_security_number: hrResult.recordset[0].Social_Security_Number,
                drivers_license: hrResult.recordset[0].Drivers_License,
                marital_status: hrResult.recordset[0].Marital_Status,
                gender: hrResult.recordset[0].Gender,
                shareholder_status: hrResult.recordset[0].Shareholder_Status === 1,
                benefit_plans: hrResult.recordset[0].Benefit_Plans,
                ethnicity: hrResult.recordset[0].Ethnicity,
                pay_rate: payrollResult[0].Pay_Rate,
                payrates_id: payrollResult[0].PayRates_id,
                vacation_days: payrollResult[0].Vacation_Days,
                paid_to_date: payrollResult[0].Paid_To_Date,
                paid_last_year: payrollResult[0].Paid_Last_Year
            };

            return employee;
        } catch (error) {
            throw new Error(`Failed to get employee: ${error.message}`);
        }
    }

    async updateEmployee(id, employeeData) {
        try {
            const transformedData = this.transformEmployeeData(employeeData);
            await this.updateInBothDatabases(id, transformedData);
            return {
                employee_id: id,
                message: 'Employee updated successfully'
            };
        } catch (error) {
            throw new Error(`Failed to update employee: ${error.message}`);
        }
    }

    async updateInBothDatabases(id, transformedData) {
        try {
            // Update HR.dbo.Personal (SQL Server)
            const personalQuery = `
                UPDATE [HR].[dbo].[Personal]
                SET First_Name = @First_Name,
                    Last_Name = @Last_Name,
                    Middle_Initial = @Middle_Initial,
                    Address1 = @Address1,
                    Address2 = @Address2,
                    City = @City,
                    State = @State,
                    ZIP = @ZIP,
                    Email = @Email,
                    Phone_Number = @Phone_Number,
                    Social_Security_Number = @Social_Security_Number,
                    Drivers_License = @Drivers_License,
                    Marital_Status = @Marital_Status,
                    Gender = @Gender,
                    Shareholder_Status = @Shareholder_Status,
                    Benefit_Plans = @Benefit_Plans,
                    Ethnicity = @Ethnicity
                WHERE Employee_ID = @Employee_ID
            `;

            const request = new sql.Request();
            request.input('Employee_ID', id);
            request.input('First_Name', transformedData.personal.First_Name);
            request.input('Last_Name', transformedData.personal.Last_Name);
            request.input('Middle_Initial', transformedData.personal.Middle_Initial);
            request.input('Address1', transformedData.personal.Address1);
            request.input('Address2', transformedData.personal.Address2);
            request.input('City', transformedData.personal.City);
            request.input('State', transformedData.personal.State);
            request.input('ZIP', transformedData.personal.ZIP);
            request.input('Email', transformedData.personal.Email);
            request.input('Phone_Number', transformedData.personal.Phone_Number);
            request.input('Social_Security_Number', transformedData.personal.Social_Security_Number);
            request.input('Drivers_License', transformedData.personal.Drivers_License);
            request.input('Marital_Status', transformedData.personal.Marital_Status);
            request.input('Gender', transformedData.personal.Gender);
            request.input('Shareholder_Status', transformedData.personal.Shareholder_Status);
            request.input('Benefit_Plans', transformedData.personal.Benefit_Plans);
            request.input('Ethnicity', transformedData.personal.Ethnicity);

            await request.query(personalQuery);

            // Update payroll.employee (MySQL)
            const employeeQuery = `
                UPDATE employee
                SET First_Name = ?,
                    Last_Name = ?,
                    SSN = ?,
                    Pay_Rate = ?,
                    PayRates_id = ?,
                    Vacation_Days = ?,
                    Paid_To_Date = ?,
                    Paid_Last_Year = ?
                WHERE idEmployee = ?
            `;

            const payrollConnection = await this.dbPayroll.getConnection();
            try {
                await payrollConnection.query(employeeQuery, [
                    transformedData.employee.First_Name,
                    transformedData.employee.Last_Name,
                    transformedData.employee.SSN,
                    transformedData.employee.Pay_Rate,
                    transformedData.employee.PayRates_id,
                    transformedData.employee.Vacation_Days,
                    transformedData.employee.Paid_To_Date,
                    transformedData.employee.Paid_Last_Year,
                    id
                ]);
            } finally {
                payrollConnection.release();
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteEmployee(id) {
        try {
            await this.deleteFromBothDatabases(id);
            return {
                employee_id: id,
                message: 'Employee deleted successfully'
            };
        } catch (error) {
            throw new Error(`Failed to delete employee: ${error.message}`);
        }
    }

    async deleteFromBothDatabases(id) {
        try {
            // Delete from HR.dbo.Personal (SQL Server)
            const personalQuery = `
                DELETE FROM [HR].[dbo].[Personal]
                WHERE Employee_ID = @id
            `;

            // Delete from payroll.employee (MySQL)
            const employeeQuery = `
                DELETE FROM employee
                WHERE idEmployee = ?
            `;

            const request = new sql.Request();
            request.input('id', id);

            await Promise.all([
                request.query(personalQuery),
                this.dbPayroll.query(employeeQuery, [id])
            ]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = (dbHR, dbPayroll) => new EmployeeService(dbHR, dbPayroll); 