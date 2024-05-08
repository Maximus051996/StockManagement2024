const mongoose = require('mongoose');

// Define User schema
const CompanySchema = new mongoose.Schema({
    companyId: String,
    companyName: String,
    isActive: Boolean
}, { collection: 'tbl_company' });

// Export User model
module.exports = mongoose.model('Company', CompanySchema);
