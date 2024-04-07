const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    console.log('Error coming ...')
    // Your register route logic
});

router.post('/login', async (req, res) => {
    const { userName, userPassword } = req.body;

    // Your login route logic
});

module.exports = router;
