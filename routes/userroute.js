const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret_key = 'EO["ZO!F9MD/1Qd'


router.post('/register', async (req, res) => {
    try {
        const { userName, roleId, phone, email, userPassword, address, companyAssigned } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        // Create a new user instance with hashed password
        const newUser = new User({
            userName,
            roleId,
            phone,
            email,
            userPassword: hashedPassword,
            address,
            companyAssigned,
            isActive: true // Assuming the user is active upon registration
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { userName, userPassword } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, roleId: user.roleId }, secret_key, { expiresIn: '1h' });

        // Return token 
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
