const express = require('express');
const router = express.Router();
const statisticsServiceFactory = require('../services/statisticsService');

// Middleware để tạo service instance cho mỗi request
router.use((req, res, next) => {
    try {
        req.statisticsService = statisticsServiceFactory(req.app.locals.dbHR, req.app.locals.dbPayroll);
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Income statistics routes
router.get('/income/shareholder', async (req, res) => {
    try {
        const result = await req.statisticsService.getTotalIncomeByShareholder();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/income/gender', async (req, res) => {
    try {
        const result = await req.statisticsService.getTotalIncomeByGender();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/income/ethnicity', async (req, res) => {
    try {
        const result = await req.statisticsService.getTotalIncomeByEthnicity();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/income/employment-type', async (req, res) => {
    try {
        const result = await req.statisticsService.getTotalIncomeByEmploymentType();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/income/year', async (req, res) => {
    try {
        const result = await req.statisticsService.getTotalIncomeByYear();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/income/department', async (req, res) => {
    try {
        const result = await req.statisticsService.getTotalIncomeByDepartment();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Vacation days statistics routes
router.get('/vacation/shareholder', async (req, res) => {
    try {
        const result = await req.statisticsService.getTotalVacationDaysByShareholder();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/vacation/gender', async (req, res) => {
    try {
        const result = await req.statisticsService.getTotalVacationDaysByGender();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/vacation/ethnicity', async (req, res) => {
    try {
        const result = await req.statisticsService.getTotalVacationDaysByEthnicity();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/vacation/employment-type', async (req, res) => {
    try {
        const result = await req.statisticsService.getTotalVacationDaysByEmploymentType();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/vacation/year', async (req, res) => {
    try {
        const result = await req.statisticsService.getTotalVacationDaysByYear();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Benefits statistics routes
router.get('/benefits/shareholder', async (req, res) => {
    try {
        const result = await req.statisticsService.getAverageBenefitsByShareholder();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/benefits/plan', async (req, res) => {
    try {
        const result = await req.statisticsService.getAverageBenefitsByPlan();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all employees route
router.get('/employees', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        // Sắp xếp theo employee_id giảm dần (mới nhất lên đầu)
        let result = await req.statisticsService.getAllEmployees();
        result = result.sort((a, b) => b.employee_id - a.employee_id);
        const total = result.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const employees = result.slice(start, end);
        res.json({
            success: true,
            data: {
                employees,
                total,
                page,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router; 