const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Company = require('../models/company');
const User = require('../models/user');
const Product = require('../models/product');
const msg = require('../enum/messages');




// Use authenticateToken middleware in your routes
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
        const productCount = await Product.countDocuments({ isdamage: true });
        res.json({ productCount: productCount });
    } catch (error) {
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});



router.get('/top-five-productCountAsc-list', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Ins-Dashboard']
    try {
        const topProducts = await Product.aggregate([
            // Group by companyId and sum up the quantities
            {
                $group: {
                    _id: "$companyId",
                    totalQuantity: { $sum: "$quantity" }
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
            }
        ]);

        // Combine quantities for the same company
        const combinedResult = {};
        topProducts.forEach(product => {
            if (!combinedResult[product.companyName]) {
                combinedResult[product.companyName] = 0;
            }
            combinedResult[product.companyName] += product.totalQuantity;
        });

        // Sort the combined result by company name first
        const sortedResult = Object.entries(combinedResult)
            .map(([companyName, totalQuantity]) => ({ companyName, totalQuantity }))
            .sort((a, b) => {
                // Sort by company name
                if (a.companyName < b.companyName) return -1;
                if (a.companyName > b.companyName) return 1;
                // If company names are equal, sort by total quantity in descending order
                return b.totalQuantity - a.totalQuantity;
            });

        // Limit to top 5 products
        const topFive = sortedResult.slice(0, 5);

        res.json(topFive);
    } catch (error) {
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});

module.exports = router;