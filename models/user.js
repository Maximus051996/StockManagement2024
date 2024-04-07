const mongoose = require('mongoose');

// Define User schema
const UserSchema = new mongoose.Schema({
    userName: String,
    phone: String,
    email: String,
    userPassword: String,
    address: String,
    companyAssigned: String,
    isActive: Boolean
});


const User = mongoose.model('User', UserSchema);