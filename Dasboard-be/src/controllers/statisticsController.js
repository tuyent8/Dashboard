const statisticsService = require('../services/statisticsService');

// 1. Tổng thu nhập theo cổ đông
exports.getTotalIncomeByShareholder = async (req, res) => {
    try {
        const result = await statisticsService.getTotalIncomeByShareholder();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Tổng thu nhập theo giới tính
exports.getTotalIncomeByGender = async (req, res) => {
    try {
        const result = await statisticsService.getTotalIncomeByGender();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Tổng thu nhập theo sắc tộc
exports.getTotalIncomeByEthnicity = async (req, res) => {
    try {
        const result = await statisticsService.getTotalIncomeByEthnicity();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Tổng thu nhập theo loại nhân viên (bán thời gian/toàn thời gian)
exports.getTotalIncomeByEmploymentType = async (req, res) => {
    try {
        const result = await statisticsService.getTotalIncomeByEmploymentType();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Tổng thu nhập theo thời gian (năm hiện tại và năm trước)
exports.getTotalIncomeByYear = async (req, res) => {
    try {
        const result = await statisticsService.getTotalIncomeByYear();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Tổng thu nhập theo phòng ban
exports.getTotalIncomeByDepartment = async (req, res) => {
    try {
        const result = await statisticsService.getTotalIncomeByDepartment();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 7. Tổng số ngày nghỉ phép theo cổ đông
exports.getTotalVacationDaysByShareholder = async (req, res) => {
    try {
        const result = await statisticsService.getTotalVacationDaysByShareholder();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 8. Tổng số ngày nghỉ phép theo giới tính
exports.getTotalVacationDaysByGender = async (req, res) => {
    try {
        const result = await statisticsService.getTotalVacationDaysByGender();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 9. Tổng số ngày nghỉ phép theo sắc tộc
exports.getTotalVacationDaysByEthnicity = async (req, res) => {
    try {
        const result = await statisticsService.getTotalVacationDaysByEthnicity();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 10. Tổng số ngày nghỉ phép theo loại nhân viên
exports.getTotalVacationDaysByEmploymentType = async (req, res) => {
    try {
        const result = await statisticsService.getTotalVacationDaysByEmploymentType();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 11. Tổng số ngày nghỉ phép theo năm
exports.getTotalVacationDaysByYear = async (req, res) => {
    try {
        const result = await statisticsService.getTotalVacationDaysByYear();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 12. Trung bình quyền lợi theo cổ đông
exports.getAverageBenefitsByShareholder = async (req, res) => {
    try {
        const result = await statisticsService.getAverageBenefitsByShareholder();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 13. Trung bình quyền lợi theo gói
exports.getAverageBenefitsByPlan = async (req, res) => {
    try {
        const result = await statisticsService.getAverageBenefitsByPlan();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};