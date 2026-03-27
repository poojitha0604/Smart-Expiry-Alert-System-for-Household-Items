# Smart Expiry Alert System for Household Items

A full-stack web application designed to help users manage household items, track expiration dates, and receive timely automated warnings before items expire. 

## Features

- **Item Management**: Add, view, edit, and delete household items.
- **Expiry Tracking**: Keep track of expiration dates with visual status indicators (e.g., Safe, Expiring Soon, Expired).
- **Automated Email Notifications**: Scheduled cron jobs run periodically to send email alerts to users for items that are approaching their expiration dates.
- **Secure Authentication**: User registration and login functionality using JWT (JSON Web Tokens) and secure password hashing with bcrypt.
- **RESTful API**: Structured backend application architecture for handling CRUD operations.

## Technology Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: MySQL (using `mysql2` connector)
- **Authentication**: `jsonwebtoken` and `bcryptjs`
- **Session/Cookie Management**: `cookie-parser`
- **Job Scheduling**: `node-cron`
- **Email Service**: `nodemailer`
- **Environment Management**: `dotenv`

## Project Structure

```text
smart-expiry-alart/
├── config/             # Database and other configuration files
├── controllers/        # Route controllers containing business logic
├── models/             # Database models and schemas
├── public/             # Static frontend files (HTML, CSS, JS)
├── routes/             # Express API route definitions
├── services/           # Background jobs (e.g., crons) and reusable services
├── .env                # Environment variables (not tracked in git)
├── package.json        # Dependencies and scripts
└── server.js           # Main application entry point
```

## Prerequisites

- **Node.js**: v14.x or higher
- **MySQL**: Running MySQL server

## Getting Started

Follow these steps to set up and run the application locally:

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd smart-expiry-alart
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following configuration variables required by the application:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smart_expiry_db
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

*(Note: If using Gmail for NodeMailer, you may need to generate an "App Password" via your Google Account settings).*

### 4. Database Setup

Ensure your MySQL server is running. Create a database matching your `DB_NAME` in the `.env` file:

```sql
CREATE DATABASE smart_expiry_db;
```
*(Any required table creation scripts should be run at this step if a migration script is provided, otherwise, ensure models sync with the DB).*

### 5. Running the Application

To start the server:

```bash
node server.js
```

The application will be accessible at `http://localhost:3000` (or the port defined in your `.env`).

## License

This project is licensed under the ISC License.
