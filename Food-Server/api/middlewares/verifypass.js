



// middlewares/verifyPass.js
const asyncHandler = require('express-async-handler');
const levenshteinDistance = require('js-levenshtein');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import the User model

const commonPasswords = ["password", "123456", "qwerty", "admin"]; //

const verifyPass = asyncHandler(async (req, res, next) => {
    const { password, name, email } = req.body;
    const errors = [];

    // Check password complexity
    if (password.length < 8) errors.push({ check: "at least 8 characters", status: true });
    if (!/[A-Z]/.test(password)) errors.push({ check: "at least one uppercase letter", status: true });
    if (!/[a-z]/.test(password)) errors.push({ check: "at least one lowercase letter", status: true });
    if (!/[0-9]/.test(password)) errors.push({ check: "at least one number", status: true });
    if (!/[!@#$%^&*]/.test(password)) errors.push({ check: "at least one special character", status: true });

    // Check if password contains name or email
    const nameSegments = name.split(' ');
    const emailName = email.split('@')[0];
    const emailDomain = email.split('@')[1];

    const nameOrEmailInPwd = nameSegments.some(segment => password.toLowerCase().includes(segment.toLowerCase())) ||
        password.toLowerCase().includes(emailName.toLowerCase()) ||
        password.toLowerCase().includes(emailDomain.toLowerCase());

    if (nameOrEmailInPwd) {
        errors.push({ check: "password should not contain name or email", status: true });
    }

    // Check if password is too common (using Levenshtein distance)
    const isSimilarToCommonPassword = commonPasswords.some(pwd => {
        const similarityThreshold = Math.min(password.length / 3, 4);
        const distance = levenshteinDistance(password.toLowerCase(), pwd.toLowerCase());
        return distance <= similarityThreshold;
    });

    if (isSimilarToCommonPassword) {
        errors.push({ check: "password is too common", status: true });
    }

    // Check if password was used recently
    const user = await User.findOne({ email });
    if (user && await user.isPasswordInHistory(password)) {
        errors.push({ check: "password has been used recently", status: true });
    }

    if (errors.length > 0) {
        return res.status(400).json(errors);
    }

    next();
});

module.exports = verifyPass;
