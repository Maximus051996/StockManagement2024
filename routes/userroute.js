const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_key } = require('../constants/config');
const msg = require('../enum/messages');
const Roles = require('../enum/role');
const { sendMail } = require('../middleware/emailMiddleware');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/add-user', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['User-Module']
    try {
        const { firstName, lastName, userName, roleId, phone, email, userPassword, address } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: msg.USER_EXIST });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        // Create a new user instance with hashed password
        const newUser = new User({
            firstName,
            lastName,
            userName,
            roleId,
            phone,
            email,
            userPassword: hashedPassword,
            address,
            isActive: true // Assuming the user is active upon registration
        });

        // Save the user to the database
        await newUser.save();

        res.status(200).json({ message: msg.USER_REGISTERED });
    } catch (error) {
        res.status(500).json({ message: msg.INTERNAL_SERVER_ERROR });
    }
});


router.put('/update-user/:id', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['User-Module']
    try {
        const { id } = req.params;
        const { userName, roleId, phone, email, address } = req.body;

        const existingUser = await User.findById({ _id: id });
        if (!existingUser) {
            return res.status(404).json({ message: msg.NOT_FOUND_ERROR });
        }


        existingUser.userName = userName || existingUser.userName;
        existingUser.roleId = roleId || existingUser.roleId;
        existingUser.phone = phone || existingUser.phone;
        existingUser.email = email || existingUser.email;
        existingUser.address = address || existingUser.address;

        await existingUser.save();

        res.status(200).json({ message: msg.UPDATE_RECORD_MESSAGE });
    } catch (error) {
        res.status(500).json({ message: msg.INTERNAL_SERVER_ERROR });
    }
});


router.get('/get-user-details', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['User-Module']
    try {
        const users = await User.aggregate([
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    roleId: 1,
                    phone: 1,
                    email: 1,
                    address: 1,
                    isActive: 1,
                    fullName: { $concat: ["$firstName", " ", "$lastName"] }
                }
            }
        ]);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: msg.INTERNAL_SERVER_ERROR });
    }
});


router.get('/get-user-details-byId/:id', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['User-Module']
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id }).select('-userPassword');
        if (!user) {
            return res.status(404).json({ message: msg.NOT_FOUND_ERROR });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: msg.INTERNAL_SERVER_ERROR });
    }
});


router.delete('/delete-user/:id', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['User-Module']
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.status(404).json({ message: msg.NOT_FOUND_ERROR });
        }

        user.isActive = false;
        await user.save();

        // Fetch all records after deletion
        const allusers = await User.aggregate([
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    roleId: 1,
                    phone: 1,
                    email: 1,
                    address: 1,
                    isActive: 1,
                    fullName: { $concat: ["$firstName", " ", "$lastName"] }
                }
            }
        ]);

        res.status(200).json({ message: msg.DELETE_RECORD_MESSAGE, users: allusers });
    } catch (error) {
        res.status(500).json({ message: msg.INTERNAL_SERVER_ERROR });
    }
});


router.post('/login', async (req, res) => {
    // #swagger.tags = ['User-Module']
    const { userName, userPassword } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: msg.USER_NOT_FOUND_ERROR });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: msg.INVALID_PASSWORD });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, roleId: user.roleId, userName: user.userName }, secret_key, { expiresIn: '30m' });

        // Return token 
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: msg.INTERNAL_SERVER_ERROR });
    }
});


router.post('/send-mail', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['User-Module']
    const { userName, touserMail, touserPassword, roleId } = req.body;
    // Determine the role
    const roleName = Roles[roleId];

    // Customize email content based on the role
    const shopName = 'New Maa Durga Store';
    try {
        // Generate mail content
        const mailSubject = `Welcome to ${shopName} Family`;
        const mailText = `
        Hello ${userName},
    
        Welcome to ${shopName}!
    
        We are thrilled to have you onboard as our new ${roleName}. Your role is essential to our success, and we look forward to achieving great things together.
    
        Please find the credentials for your reference:
        UserName - ${userName}
        Password - ${touserPassword}
        User Email - ${touserMail}
    
        If you have any questions or need assistance, feel free to reach out.
    
        Best regards,
        The ${shopName} Team
    `;

        const mailHtml = `
        <p>Hello ${userName},</p>
        <p>Welcome to <strong>${shopName}</strong>!</p>
        <p>We are thrilled to have you onboard as our new <strong>${roleName}</strong>. Your role is essential to our success, and we look forward to achieving great things together.</p>
        <p>Please find the credentials for your reference : </p>
        <p>UserName - <b>${userName}</b> </p>
        <p>Password - <b>${touserPassword}</b> </p>
        <p>User Email - <b>${touserMail}</b>  </p>
        <p>If you have any questions or need assistance, feel free to reach out.</p>
        <p>Best regards,<br>${shopName} Team</p>
    `;

        // Send mail
        await sendMail(touserMail, mailSubject, mailText, mailHtml);

        res.status(200).json({ message: msg.EMAIL_SENT_MESSAGE });
    } catch (error) {
        res.status(500).json({ message: msg.INTERNAL_SERVER_ERROR });
    }
});


router.get('/activate-user/:id', authenticateToken(['R2']), async (req, res) => {
    // #swagger.tags = ['User-Module']
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.status(404).json({ message: msg.NOT_FOUND_ERROR });
        }

        user.isActive = true;
        await user.save();

        // Fetch all records after deletion
        const allusers = await User.aggregate([
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    roleId: 1,
                    phone: 1,
                    email: 1,
                    address: 1,
                    isActive: 1,
                    fullName: { $concat: ["$firstName", " ", "$lastName"] }
                }
            }
        ]);

        res.status(200).json({ message: msg.ACTIVATE_USER, users: allusers });
    } catch (error) {
        res.status(500).json({ message: msg.INTERNAL_SERVER_ERROR });
    }
});

module.exports = router;
