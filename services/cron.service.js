const cron = require('node-cron');
const { pool } = require('../config/db');
const emailService = require('./email.service');

// A function to check expiry and trigger simulated emails
async function checkExpiries() {
    try {
        console.log('Running Expiry Check Cron Job...');
        // Find items that expire today, or in 3, or in 7 days.
        const [items] = await pool.query(`
            SELECT items.item_name, items.expiry_date, users.email
            FROM items
            JOIN users ON items.user_id = users.id
            WHERE DATEDIFF(items.expiry_date, CURDATE()) IN (0, 3, 7)
        `);

        if (items.length > 0) {
            console.log(`Found ${items.length} items needing alerts.`);
            for (const item of items) {
                // To safely calculate days left in JS without timezone issues
                const expiry = new Date(item.expiry_date);
                const today = new Date();
                const timeDiff = expiry.getTime() - today.getTime();
                const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                
                await emailService.sendExpiryEmail(item.email, item.item_name, daysLeft);
            }
        } else {
            console.log('No alerts needed at this time.');
        }
    } catch (error) {
        console.error('Error during cron execution:', error);
    }
}

exports.startCronJob = () => {
    // For testing and "normal automation", we'll run it once an hour, but you can change it to daily.
    // '0 0 * * *' = everyday at midnight. 
    // '* * * * *' = every minute (for fast testing)
    // We will use every 15 minutes for a nice balance while the app is running.
    cron.schedule('*/15 * * * *', checkExpiries);
    
    // Also run it once immediately on startup so we can see the console logs!
    checkExpiries();
};
