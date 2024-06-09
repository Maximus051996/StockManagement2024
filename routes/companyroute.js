const express = require('express');
const router = express.Router();
const Company = require('../models/company');
const authenticateToken = require('../middleware/authMiddleware');
const msg = require('../enum/messages');


router.get('/company-details', authenticateToken(['R2', 'R1']), async (req, res) => {
    // #swagger.tags = ['Company-Module']
    try {
        // Find all company details
        const companies = await Company.find();

        // Respond with the list of companies
        res.json(companies);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.post('/add-company', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Company-Module']
    try {
        // Extract company details from the request body
        const { companyName } = req.body;

        // Validate required fields
        if (!companyName) {
            return res.status(400).json({ error: msg.MANDATORY_FIELDS_ERROR });
        }

        // Find the last record based on createdDate
        const lastCompany = await Company.findOne().sort({ createdDate: -1 });

        // Increment companyId
        let nextCompanyId = 'C1'; // Default value if no companies exist
        if (lastCompany) {
            const lastCompanyId = lastCompany.companyId;
            const lastNumber = parseInt(lastCompanyId.slice(1)); // Extract the number from the companyId
            nextCompanyId = 'C' + (lastNumber + 1); // Increment the number and concatenate with 'C'
        }

        // Check for duplicate companyName
        const existingCompany = await Company.findOne({ companyName });

        if (existingCompany) {
            return res.status(200).json({ message: msg.DUBLICATE_ERROR, isdublicate: true });
        }

        // Create a new company document
        const newCompany = new Company({
            companyId: nextCompanyId,
            companyName,
            createdDate: new Date(),
            updatedDate: null
        });

        // Save the new company document to the database
        await newCompany.save();

        // Respond with success message
        res.status(200).json({ message: msg.ADD_RECORD_MESSAGE, isdublicate: false });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.delete('/delete-company/:id', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Company-Module']

    try {
        const { id } = req.params;

        // Check if company exists
        const company = await Company.findById({ _id: id });

        if (!company) {
            return res.status(404).json({ error: msg.NOT_FOUND_ERROR });
        }

        // If company exists, delete it
        await Company.deleteOne({ _id: id });

        // Fetch all records after deletion
        const allCompanies = await Company.find();

        res.json({ message: msg.DELETE_RECORD_MESSAGE, companies: allCompanies });
    } catch (error) {
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.put('/update-company/:id', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Company-Module']

    try {
        const { id } = req.params;

        // Check if company exists
        const existingCompany = await Company.findById({ _id: id });

        if (!existingCompany) {
            return res.status(404).json({ error: msg.NOT_FOUND_ERROR });
        }

        // Update company details
        const { companyName } = req.body;

        if (companyName) {
            existingCompany.companyName = companyName;
            existingCompany.updatedDate = new Date();
        }


        // Save the updated company document
        await existingCompany.save();

        res.json({ message: msg.UPDATE_RECORD_MESSAGE });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.get('/company-details/:id', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Company-Module']

    try {
        const { id } = req.params;

        // Find company by ID
        const company = await Company.findById({ _id: id });

        if (!company) {
            return res.status(404).json({ error: msg.NOT_FOUND_ERROR });
        }

        res.json(company);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});


router.post('/import-companies', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['Company-Module']
    try {
        const companies = req.body;

        // Validate required fields
        if (!Array.isArray(companies) || companies.length === 0) {
            return res.status(400).json({ error: msg.MANDATORY_FIELDS_ERROR });
        }

        const lastCompany = await Company.findOne().sort({ createdDate: -1 });

        // Increment companyId
        let nextCompanyIdNumber = 1; // Default value if no companies exist
        if (lastCompany) {
            const lastCompanyId = lastCompany.companyId;
            nextCompanyIdNumber = parseInt(lastCompanyId.slice(1)) + 1; // Extract the number from the companyId and increment
        }

        const newCompanies = [];
        const duplicateCompanies = [];

        // Check for duplicates and prepare new company objects
        for (const company of companies) {
            const { companyName } = company;

            // Check for duplicate companyName
            const existingCompany = await Company.findOne({ companyName });

            if (existingCompany) {
                duplicateCompanies.push({ companyName, isDuplicate: true });
            } else {
                newCompanies.push({
                    companyId: 'C' + nextCompanyIdNumber++,
                    companyName,
                    createdDate: new Date(),
                    updatedDate: null
                });
            }
        }

        // Save new companies if there are any
        if (newCompanies.length > 0) {
            await Company.insertMany(newCompanies);
        }

        // Respond with success message and duplicates information
        res.status(200).json({
            message: newCompanies.length > 0 ? msg.ADD_RECORD_MESSAGE : msg.DUBLICATE_ERROR,
            duplicates: duplicateCompanies
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: msg.INTERNAL_SERVER_ERROR });
    }
});



module.exports = router;
