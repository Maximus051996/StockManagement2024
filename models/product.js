const mongoose = require('mongoose');

// Define the schema
const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    companyId: {
        type: String,
        required: true
    },
    MRP: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    percentage: {
        type: String
    },
    formula: {
        type: String
    },
    persondiscount: {
        type: Map,
        of: String
    },
    quantity: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    dOExpiry: {
        type: Date,
        required: true
    },
    isdamage: {
        type: Boolean,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
}, { collection: 'tbl_product' });

// Create a Mongoose model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
