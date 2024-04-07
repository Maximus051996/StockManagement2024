const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userroute');

const app = express();

app.use(cors({
    credentials: true,
    origin: '*'
}));

app.use(cookieParser());
app.use(express.json());
app.use(userRoutes);

mongoose.connect('mongodb+srv://smsAdmin:sms896152@clustersms.vjntvot.mongodb.net/db_stockManagementSystem?retryWrites=true&w=majority&appName=Clustersms')
    .then(() => app.listen(3000, () => console.log("APP STARTED ...")))
    .catch((error) => console.log(error));
