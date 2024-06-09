const express = require('express');
const router = express.Router();
const { Product, DamageProduct } = require('../models/product');
const Company = require('../models/company');
const authenticateToken = require('../middleware/authMiddleware');
const msg = require('../enum/messages');

router.post('/add-product', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Product-Module']
    try {

        const { productName, companyId, productDetails, totalQuantity } = req.body;

        // Validate input
        if (!productName || !companyId) {
            return res.status(400).json({ error: msg.MANDATORY_FIELDS_ERROR });
        }

        // Check for duplicate product
        const existingProduct = await Product.findOne({ productName, companyId });
        if (existingProduct) {
            return res.status(400).json({ error: msg.DUBLICATE_ERROR });
        }

        // Generate productId
        let nextProductId = 'P1'; // Default value if no products exist
        const lastProduct = await Product.findOne().sort({ productId: -1 });
        if (lastProduct) {
            const lastProductId = lastProduct.productId;
            const lastNumber = parseInt(lastProductId.slice(1)); // Extract the number from the productId
            nextProductId = 'P' + (lastNumber + 1); // Increment the number and concatenate with 'P'
        }

        // Create new product
        const newProduct = new Product({
            productId: nextProductId,
            productName,
            companyId,
            productDetails,
            totalQuantity
        });

        // Save the product to the database
        await newProduct.save();

        // Respond with the created product
        res.status(200).json({ message: msg.ADD_RECORD_MESSAGE });


    } catch (error) {
        // Handle errors
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.get('/product-details', authenticateToken(['R2', 'R1']), async (req, res) => {
    // #swagger.tags = ['Product-Module']
    try {
        // Fetch all products
        const products = await Product.find();

        // Respond with the list of companies
        res.json(products);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.get('/product-details-companyId/:id', authenticateToken(['R2', 'R1']), async (req, res) => {
    // #swagger.tags = ['Product-Module']
    try {
        const companyId = req.params.id;
        // Fetch all products
        const products = await Product.find({ companyId });

        if (!products) {
            return res.status(200).json({ error: msg.NOT_FOUND_ERROR });
        }
        // Respond with the list of companies
        res.json(products);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.delete('/delete-product/:id', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Product-Module']
    try {
        const _id = req.params.id;

        // Delete the product by productId
        const deletedProduct = await Product.findOneAndDelete({ _id });

        if (!deletedProduct) {
            return res.status(404).json({ error: msg.NOT_FOUND_ERROR });
        }

        const allproducts = await Product.find();

        res.status(200).json({ message: msg.DELETE_RECORD_MESSAGE, products: allproducts });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.get('/product-details/:id', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Product-Module']
    try {
        const _id = req.params.id;

        // Find the product by productId
        const product = await Product.findOne({ _id });

        if (!product) {
            return res.status(404).json({ error: msg.NOT_FOUND_ERROR });
        }

        res.status(200).json(product);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.put('/update-product/:id', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Product-Module']
    try {
        const { id } = req.params;

        const { productName, companyId, productDetails, totalQuantity } = req.body;

        if (!id || !productName || !companyId) {
            return res.status(400).json({ error: msg.MANDATORY_FIELDS_ERROR });
        }

        // Find the product by _id, productId, and companyId
        const product = await Product.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    productName,
                    companyId,
                    productDetails,
                    totalQuantity
                }
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ error: msg.NOT_FOUND_ERROR });
        }

        // Respond with the updated product
        res.status(200).json({ message: msg.UPDATE_RECORD_MESSAGE });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.post('/import-products', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Product-Module']
    try {
        const products = req.body;

        // Validate required fields
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: msg.MANDATORY_FIELDS_ERROR });
        }

        // Fetch all companies and products at once
        const companies = await Company.find({});
        const companyMap = companies.reduce((acc, company) => {
            acc[company.companyName] = company;
            return acc;
        }, {});

        const existingProducts = await Product.find({});
        const productMap = existingProducts.reduce((acc, product) => {
            if (!acc[product.companyId]) {
                acc[product.companyId] = {};
            }
            acc[product.companyId][product.productName] = product;
            return acc;
        }, {});

        const newProducts = [];
        const updatedProducts = [];
        const duplicateProducts = [];

        // Process each product entry
        for (const product of products) {
            const { companyName, productName, mrp, quantity, defaultpercentage, dOExpiry, selectedWarehouse } = product;

            // Validate input
            if (!companyName || !productName) {
                return res.status(400).json({ error: msg.MANDATORY_FIELDS_ERROR });
            }

            // Check if company exists
            const existingCompany = companyMap[companyName];

            if (!existingCompany) {
                return res.status(400).json({ error: `${companyName} does not exist.` });
            }

            const companyId = existingCompany.companyId;

            // Check if product exists within the company
            const existingProduct = productMap[companyId] && productMap[companyId][productName];

            const newProductDetails = {
                selectedWarehouse: selectedWarehouse,
                mrp: mrp,
                defaultpercentage: defaultpercentage,
                quantity: quantity,
                dOExpiry: new Date(dOExpiry)
            };
            newProductDetails.dOExpiry.setHours(0, 0, 0, 0);
            if (existingProduct) {
                // Check if the product detail already exists
                let isDuplicate = false;
                for (let detail of existingProduct.productDetails) {
                    let existingDOExpiry = new Date(detail.dOExpiry);
                    existingDOExpiry.setHours(0, 0, 0, 0);
                    if (
                        detail.selectedWarehouse === selectedWarehouse &&
                        detail.mrp === mrp &&
                        detail.defaultpercentage === defaultpercentage &&
                        detail.quantity === quantity &&
                        existingDOExpiry.getTime() === newProductDetails.dOExpiry.getTime()
                    ) {
                        isDuplicate = true;
                        break;
                    }
                }

                if (isDuplicate) {
                    duplicateProducts.push({ productName, isDuplicate: true });
                } else {
                    // Update existing product details
                    existingProduct.productDetails.push(newProductDetails);
                    existingProduct.totalQuantity += quantity;
                    await existingProduct.save();
                    updatedProducts.push(existingProduct);
                }
            } else {
                let nextProductId = 'P1'; // Default value if no products exist
                const lastProduct = await Product.findOne().sort({ productId: -1 });
                if (lastProduct) {
                    const lastProductId = lastProduct.productId;
                    const lastNumber = parseInt(lastProductId.slice(1)); // Extract the number from the productId
                    nextProductId = 'P' + (lastNumber + 1); // Increment the number and concatenate with 'P'
                }
                // Insert new product
                const newProduct = new Product({
                    productId: nextProductId,
                    productName,
                    companyId: companyId,
                    productDetails: [newProductDetails],
                    totalQuantity: quantity,
                });

                await newProduct.save();
                newProducts.push(newProduct);
            }
        }

        // Respond with success message and duplicates information
        res.status(200).json({
            message: newProducts.length > 0 || updatedProducts.length > 0 ? msg.ADD_RECORD_MESSAGE : msg.DUBLICATE_ERROR,
            newProducts,
            updatedProducts,
            duplicates: duplicateProducts
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});



router.post('/add-damage-products', authenticateToken(['R2']), async (req, res) => {
    try {
        // #swagger.tags = ['Product-Module']
        const { productId, companyId, quantity, mrp, dOExpiry, isDeleted } = req.body;

        // Check for duplicates
        const existingProduct = await DamageProduct.findOne({ productId, companyId, dOExpiry, mrp });
        if (existingProduct) {
            return res.status(200).json({ message: msg.DUBLICATE_ERROR });
        }

        // Create a new damage product
        const newDamageProduct = new DamageProduct({ productId, companyId, quantity, mrp, dOExpiry, isDeleted });
        await newDamageProduct.save();

        res.status(200).json({ message: msg.ADD_RECORD_MESSAGE });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/get-damage-products-details', authenticateToken(['R2']), async (req, res) => {
    try {
        // #swagger.tags = ['Product-Module']
        const damageProducts = await DamageProduct.find();
        res.status(200).json(damageProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/damage-products-byId/:id', authenticateToken(['R2']), async (req, res) => {
    try {
        // #swagger.tags = ['Product-Module']
        const damageProduct = await DamageProduct.findById(req.params.id);
        if (!damageProduct) {
            return res.status(404).json({ error: msg.NOT_FOUND_ERROR });
        }
        res.status(200).json(damageProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/update-damage-product/:id', authenticateToken(['R2']), async (req, res) => {
    try {
        // #swagger.tags = ['Product-Module']
        const { quantity, mrp } = req.body;
        const updatedDamageProduct = await DamageProduct.findByIdAndUpdate(
            req.params.id,
            { quantity, mrp },
            { new: true }
        );
        if (!updatedDamageProduct) {
            return res.status(404).json({ error: msg.NOT_FOUND_ERROR });
        }
        res.status(200).json({ message: msg.UPDATE_RECORD_MESSAGE });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/delete-damage-products/:id', authenticateToken(['R2']), async (req, res) => {
    try {
        // #swagger.tags = ['Product-Module']
        const damageProduct = await DamageProduct.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!damageProduct) {
            return res.status(404).json({ error: msg.NOT_FOUND_ERROR });
        }

        res.status(200).json({ message: msg.PRODUCT_RELEASED });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/import-damage-products', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Company-Module']
    try {
        const damageProducts = req.body;

        // Validate required fields
        if (!Array.isArray(damageProducts) || damageProducts.length === 0) {
            return res.status(400).json({ error: msg.MANDATORY_FIELDS_ERROR });
        }

        const companies = await Company.find({});
        const companyMap = companies.reduce((acc, company) => {
            acc[company.companyName] = company;
            return acc;
        }, {});

        const products = await Product.find({});
        const productMap = products.reduce((acc, product) => {
            acc[product.productName] = product;
            return acc;
        }, {});

        const newDamageProducts = [];
        const duplicateDamageProducts = [];

        // Check for duplicates and prepare new damage product objects
        for (const damageProduct of damageProducts) {
            const { companyName, productName, quantity, mrp, dOExpiry } = damageProduct;

            const existingCompany = companyMap[companyName];

            if (!existingCompany) {
                return res.status(400).json({ error: `${companyName} does not exist.` });
            }

            const companyId = existingCompany.companyId;

            const existingProduct = productMap[productName];

            if (!existingProduct) {
                return res.status(400).json({ error: `${productName} does not exist.` });
            }

            const productId = existingProduct.productId;

            // Check for duplicate damage product
            const existingData = await DamageProduct.findOne({ productId, companyId, mrp, dOExpiry });

            if (existingData) {
                duplicateDamageProducts.push({ companyId, productId, isDuplicate: true });
            } else {
                newDamageProducts.push({
                    companyId,
                    productId,
                    quantity,
                    mrp,
                    dOExpiry
                });
            }
        }

        // Save new damage products if there are any
        if (newDamageProducts.length > 0) {
            await DamageProduct.insertMany(newDamageProducts);
        }

        // Respond with success message and duplicates information
        res.status(200).json({
            message: newDamageProducts.length > 0 ? msg.ADD_RECORD_MESSAGE : msg.DUBLICATE_ERROR,
            duplicates: duplicateDamageProducts
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});




module.exports = router;


