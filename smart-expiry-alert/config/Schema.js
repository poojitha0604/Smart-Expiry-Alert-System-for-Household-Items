const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smart_expiry_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// A helper function to create database if it doesn't exist
async function ensureDatabaseExists() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });
    const dbName = process.env.DB_NAME || 'smart_expiry_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    connection.end();
}

module.exports = { pool, ensureDatabaseExists };
