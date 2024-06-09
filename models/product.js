const mongoose = require('mongoose');

// Define the product schema
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
    productDetails: [{
        selectedWarehouse: {
            type: String,
        },
        mrp: {
            type: Number,
        },
        defaultpercentage: {
            type: Number
        },
        quantity: {
            type: Number,
        },
        dOExpiry: {
            type: Date,
        }
    }],
    totalQuantity: {
        type: Number,
        required: true
    }
}, { collection: 'tbl_product' });


// Define the damage product schema
const damageProductSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    companyId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    dOExpiry: {
        type: Date,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { collection: 'tbl_damageProduct' });


// Create a Mongoose model
const Product = mongoose.model('Product', productSchema);
const DamageProduct = mongoose.model('DamageProduct', damageProductSchema);

// Export the models
module.exports = { Product, DamageProduct };
