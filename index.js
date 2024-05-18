const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http'); // Change to regular http module
//const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const userRoutes = require('./routes/userroute');
const insCompany = require('./routes/ins-dashboard');
const companyRoutes = require('./routes/companyroute');
const app = express();



// Middleware
app.use(cors({ credentials: true, origin: '*' }));
app.use(cookieParser());
app.use(express.json());
app.use(userRoutes);
app.use(insCompany);
app.use(companyRoutes);



// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



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
        await connectToDatabase();
        const httpServer = http.createServer(app); // Create regular HTTP server
        httpServer.listen(3000, () => {
            console.log('App started on port 3000');
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1); // Exit the process with a non-zero status code
    }
}

startServer();
