const mongoose = require('mongoose');

// Define User schema
const UserSchema = new mongoose.Schema({
    userName: String,
    roleId: String,
    phone: String,
    email: String,
    userPassword: String,
    address: String,
    companyAssigned: String,
    isActive: Boolean
}, { collection: 'tbl_users' });

// Export User model
module.exports = mongoose.model('User', UserSchema);
