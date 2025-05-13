require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createConnections } = require('./src/config/database');
const statisticsRoutes = require('./src/routes/statisticsRoutes');
const employeeRoutes = require('./src/routes/employeeRoutes');
const app = express();

// Thiết lập middleware
app.use(cors());
app.use(express.json());

async function initializeApp() {
    try {
        // Khởi tạo kết nối đến các cơ sở dữ liệu
        console.log('Đang kết nối đến databases...');
        const { mysqlPool, sqlServerPool } = await createConnections();

        console.log('Database connections:', {
            sqlServer: !!sqlServerPool,
            mysql: !!mysqlPool
        });

        // Đưa các kết nối database vào app để các route có thể sử dụng
        app.locals.dbHR = sqlServerPool;
        app.locals.dbPayroll = mysqlPool;

        // Kiểm tra xem các kết nối có tồn tại trong app.locals
        console.log('App locals database connections:', {
            dbHR: !!app.locals.dbHR,
            dbPayroll: !!app.locals.dbPayroll
        });

        // Middleware để log database connections cho mỗi request
        app.use((req, res, next) => {
            console.log('Request database connections:', {
                dbHR: !!req.app.locals.dbHR,
                dbPayroll: !!req.app.locals.dbPayroll
            });
            next();
        });

        // Sử dụng routes
        app.use('/api/statistics', statisticsRoutes);
        app.use('/api/employee', employeeRoutes);

        // Xử lý lỗi cơ bản
        app.use((err, req, res, next) => {
            console.error('Error details:', err);
            res.status(500).json({
                error: err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
        });

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server đang chạy tại cổng ${PORT}`);
        });
    } catch (error) {
        console.error('Khởi động ứng dụng thất bại:', error);
        process.exit(1);
    }
}

initializeApp();