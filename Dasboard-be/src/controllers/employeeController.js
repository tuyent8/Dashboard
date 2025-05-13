const createEmployeeService = require('../services/employeeService');

// Create new employee
exports.createEmployee = async (req, res) => {
    try {
        const employeeService = createEmployeeService(req.app.locals.dbHR, req.app.locals.dbPayroll);
        const employeeData = req.body;
        const result = await employeeService.createEmployee(employeeData);
        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: result
        });
    } catch (error) {
        // Nếu lỗi là ID đã tồn tại, trả về 400
        if (error.message === 'ID đã tồn tại') {
            return res.status(400).json({
                success: false,
                message: 'ID đã tồn tại'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create employee',
            error: error.message
        });
    }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employeeService = createEmployeeService(req.app.locals.dbHR, req.app.locals.dbPayroll);
        const { id } = req.params;
        const employee = await employeeService.getEmployeeById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
        res.json({
            success: true,
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get employee',
            error: error.message
        });
    }
};

// Update employee
exports.updateEmployee = async (req, res) => {
    try {
        const employeeService = createEmployeeService(req.app.locals.dbHR, req.app.locals.dbPayroll);
        const { id } = req.params;
        const updateData = req.body;
        const result = await employeeService.updateEmployee(id, updateData);
        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update employee',
            error: error.message
        });
    }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const employeeService = createEmployeeService(req.app.locals.dbHR, req.app.locals.dbPayroll);
        const { id } = req.params;
        await employeeService.deleteEmployee(id);
        res.json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete employee',
            error: error.message
        });
    }
};