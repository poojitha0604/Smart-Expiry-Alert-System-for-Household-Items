const mysql = require('mysql2/promise');
require('dotenv').config();

const baseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
};

// Add SSL for Aiven cloud database
if (baseConfig.host !== 'localhost' && baseConfig.host !== '127.0.0.1') {
    baseConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool({
    ...baseConfig,
    database: process.env.DB_NAME || 'smart_expiry_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// A helper function to create database if it doesn't exist
async function ensureDatabaseExists() {
    const connection = await mysql.createConnection(baseConfig);
    const dbName = process.env.DB_NAME || 'smart_expiry_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    connection.end();
}

module.exports = { pool, ensureDatabaseExists };
