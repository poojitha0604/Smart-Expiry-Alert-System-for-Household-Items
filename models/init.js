const { pool } = require('../config/db');

async function initializeDatabase() {
    try {
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        const createItemsTable = `
            CREATE TABLE IF NOT EXISTS items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                item_name VARCHAR(255) NOT NULL,
                category ENUM('Medicine', 'Grocery', 'Cosmetic', 'Food', 'Other') NOT NULL,
                purchase_date DATE,
                expiry_date DATE NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;

        await pool.query(createUsersTable);
        await pool.query(createItemsTable);
        console.log('Database tables verified/created successfully.');
    } catch (error) {
        console.error('Error initializing database tables:', error);
    }
}

module.exports = initializeDatabase;
