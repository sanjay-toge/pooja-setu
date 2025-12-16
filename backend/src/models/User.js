const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    label: { type: String, required: true }, // e.g., Home, Work
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },
    photo: String,

    // Profile Fields
    gender: String,
    dob: String, // Date of Birth
    pob: String, // Place of Birth
    gotra: String,
    rashi: String,
    nakshatra: String,

    addresses: [addressSchema],

    isProfileComplete: { type: Boolean, default: false },

    authProvider: { type: String, enum: ['phone', 'google', 'facebook', 'local'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
