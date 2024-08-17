

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;
const { MAX_LOGIN_ATTEMPTS, LOCK_TIME, PASSWORD_EXPIRATION } = require('../config');

const userSchema = new Schema({
    name: { type: String },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    mobile_no: { type: String },
    password: { type: String },
    image: { type: String },
    role: {
        type: String,
        enum: ['user', 'admin', 'super-admin'],
        default: 'user',
    },
    passwordLastChanged: { type: Date, default: Date.now },
    passwordHistory: [{
        password: String,
        changedAt: Date
    }],
    loginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date }
});

userSchema.methods.isPasswordExpired = function () {
    const now = Date.now();
    const passwordAge = now - this.passwordLastChanged.getTime();
    const passwordAgeInDays = Math.floor(passwordAge / (1000 * 60 * 60 * 24));
    return passwordAgeInDays >= PASSWORD_EXPIRATION;
};

userSchema.methods.matchPassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    if (!isMatch) {
        this.loginAttempts += 1;
        if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            this.lockedUntil = new Date(Date.now() + LOCK_TIME);
            this.loginAttempts = 0;
        }
        await this.save();
    } else {
        this.loginAttempts = 0;
        await this.save();
    }
    return isMatch;
};

userSchema.methods.isPasswordInHistory = function (newPassword) {
    return this.passwordHistory.some(async (entry) => await bcrypt.compare(newPassword, entry.password));
};

const User = mongoose.model('User', userSchema);

module.exports = User;
