const mysql = require('mysql2/promise');
const sql = require('mssql/msnodesqlv8');
require('dotenv').config();
// Cấu hình cho MySQL
const mysqlConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'payroll',
    port: process.env.MYSQL_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Cấu hình cho SQL Server
const sqlServerConfig = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.MSSQL_SERVER || 'LAPTOP-DE5RV5LV'};Database=${process.env.MSSQL_DATABASE || 'HR'};Trusted_Connection=Yes;`,
    driver: 'msnodesqlv8',
};

// Tạo kết nối MySQL
async function createMySQLConnection() {
    try {
        const pool = mysql.createPool(mysqlConfig);
        // Kiểm tra kết nối
        const connection = await pool.getConnection();
        console.log('Đã kết nối thành công đến MySQL');
        connection.release();
        return pool;
    } catch (error) {
        console.error('Lỗi kết nối MySQL:', error);
        throw error;
    }
}

// Tạo kết nối SQL Server
async function createSQLServerConnection() {
    try {
        await sql.connect(sqlServerConfig);
        console.log('Đã kết nối thành công đến SQL Server');
        return sql;
    } catch (error) {
        console.error('Lỗi kết nối SQL Server:', error);
        throw error;
    }
}

// Hàm tạo kết nối đến cả hai database
async function createConnections() {
    try {
        const mysqlPool = await createMySQLConnection();
        const sqlServerPool = await createSQLServerConnection();

        // Thêm các phương thức trợ giúp
        sqlServerPool.query = async (sqlText, params) => {
            const request = new sqlServerPool.Request();
            return await request.query(sqlText, params);
        };

        return { mysqlPool, sqlServerPool };
    } catch (error) {
        console.error('Lỗi khi tạo kết nối database:', error);
        throw error;
    }
}

module.exports = {
    createConnections,
    mysqlConfig,
    sqlServerConfig
};
