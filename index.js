const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');

const userRoutes = require('./routes/userroute');

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: '*' }));
app.use(cookieParser());
app.use(express.json());
app.use(userRoutes);

// HTTPS Server Configuration
async function createHttpsServer() {
    try {
        const [key, cert] = await Promise.all([
            fs.readFile(path.join(__dirname, 'cert', 'key.pem')),
            fs.readFile(path.join(__dirname, 'cert', 'cert.pem'))
        ]);

        const sslOptions = { key, cert };
        const sslServer = https.createServer(sslOptions, app);

        return sslServer;
    } catch (err) {
        console.error('Error reading certificate files:', err);
        throw err;
    }
}

// Database Connection
async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb+srv://smsAdmin:sms896152@clustersms.vjntvot.mongodb.net/db_stockManagementSystem?retryWrites=true&w=majority&appName=Clustersms');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Start the server
async function startServer() {
    try {
        const sslServer = await createHttpsServer();
        await connectToDatabase();
        sslServer.listen(3000, () => {
            console.log('App started with SSL on port 3000');
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1); // Exit the process with a non-zero status code
    }
}

startServer();
