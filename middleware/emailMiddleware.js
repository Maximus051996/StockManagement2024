const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_APP_PASS } = require('../constants/config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp@gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_APP_PASS
    }
});

const sendMail = async (to, subject, text, html) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject,
        text,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

module.exports = { sendMail };
