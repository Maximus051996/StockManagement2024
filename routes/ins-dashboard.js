const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Company = require('../models/company');
const User = require('../models/user');
const { Product, DamageProduct } = require('../models/product');
const msg = require('../enum/messages');


router.get('/total-company-count', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Ins-Dashboard']
    try {
        const activeCount = await Company.countDocuments();
        res.json({
            activecompanyCount: activeCount,
        });
    } catch (error) {
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.get('/active-user-count', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Ins-Dashboard']
    try {
        const userCount = await User.countDocuments({ isActive: true });
        res.json({ userCount: userCount });
    } catch (error) {
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.get('/damage-product-count', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Ins-Dashboard']
    try {
        const totalQuantity = await DamageProduct.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
        ]);

        // Handle case where there are no matching documents
        const quantityCount = totalQuantity.length > 0 ? totalQuantity[0].totalQuantity : 0;

        res.json({ productCount: quantityCount });
    } catch (error) {
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});



router.get('/all-productCount-totalQuantityDesc', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Ins-Dashboard']
    try {
        const topProducts = await Product.aggregate([
            // Group by companyId and sum up the quantities
            {
                $group: {
                    _id: "$companyId",
                    totalQuantity: { $sum: "$totalQuantity" }
                }
            },
            // Lookup company details for each product
            {
                $lookup: {
                    from: "tbl_company", // The name of the company collection
                    localField: "_id", // Field from the current collection (Product)
                    foreignField: "companyId", // Field from the foreign collection (Company)
                    as: "company"
                }
            },
            // Unwind the company array
            { $unwind: "$company" },
            // Project to select fields for the final result
            {
                $project: {
                    _id: 0, // Exclude _id field
                    totalQuantity: 1,
                    companyName: "$company.companyName"
                }
            },
            // Sort by total quantity in descending order
            { $sort: { totalQuantity: -1 } },
        ]);
        res.json(topProducts);
    } catch (error) {
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});

module.exports = router;