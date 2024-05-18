const mongoose = require('mongoose');

// Define User schema
const CompanySchema = new mongoose.Schema({
    companyId: String,
    companyName: String,
    createdDate: { type: Date, default: Date.now() },
    updatedDate: { type: Date }
}, { collection: 'tbl_company' });

// Export User model
module.exports = mongoose.model('Company', CompanySchema);
