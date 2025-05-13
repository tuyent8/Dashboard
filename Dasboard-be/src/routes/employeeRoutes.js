const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Create new employee
router.post('/create', employeeController.createEmployee);

// Get employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Update employee
router.put('/update/:id', employeeController.updateEmployee);

// Delete employee
router.delete('/delete/:id', employeeController.deleteEmployee);

module.exports = router;
