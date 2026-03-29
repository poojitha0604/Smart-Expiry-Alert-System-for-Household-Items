require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const { ensureDatabaseExists } = require('./config/db');
const initializeDatabase = require('./models/init');
const cronService = require('./services/cron.service');

const authRoutes = require('./routes/auth.routes');
const itemRoutes = require('./routes/item.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Map paths to their respective index html pages for clean URLs
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'auth.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'auth.html')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Expose an endpoint to trigger cron jobs manually in Vercel
app.get('/api/cron/trigger', async (req, res) => {
    try {
        await cronService.checkExpiries();
        res.status(200).json({ message: 'Cron job executed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to execute cron job' });
    }
});

async function startServer() {
    try {
        await ensureDatabaseExists();
        await initializeDatabase();
        
        // Start the automated emails job ONLY if running locally
        if (process.env.NODE_ENV !== 'production') {
            cronService.startCronJob();
            app.listen(PORT, () => {
                console.log(`Server successfully started on http://localhost:${PORT}`);
            });
        }
    } catch (err) {
        console.error('Failed to initialize or connect to the database', err);
    }
}

startServer();

// Vercel Serverless Export
module.exports = app;
