const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.login = async (req, res) => {
    try {
        const { method, phone, email, name, photo } = req.body;

        let user;

        if (method === 'phone') {
            user = await User.findOne({ phone });
            if (!user) {
                user = await User.create({
                    name: name || 'User',
                    phone,
                    authProvider: 'phone'
                });
            }
        } else if (method === 'facebook') {
            // Simplify for now, existing logic
            user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    name,
                    email,
                    photo,
                    authProvider: method
                });
            }
        } else {
            return res.status(400).json({ error: 'Invalid auth method' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                photo: user.photo,
                dob: user.dob,
                pob: user.pob,
                gotra: user.gotra,
                rashi: user.rashi,
                nakshatra: user.nakshatra,
                gender: user.gender,
                isProfileComplete: user.isProfileComplete
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        // Verify Google Token
        // NOTE: In development/Expo Go, client ID validation might fail if unmatched. 
        // We can skip client ID check if GOOGLE_CLIENT_ID is not strict.
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        let user = await User.findOne({
            $or: [{ googleId }, { email }]
        });

        if (user) {
            // Update existing user with googleId if missing
            if (!user.googleId) {
                user.googleId = googleId;
                if (!user.photo) user.photo = picture;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                photo: picture,
                authProvider: 'google'
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                photo: user.photo,
                isProfileComplete: user.isProfileComplete,
                // Include other fields
                phone: user.phone,
                dob: user.dob,
                pob: user.pob,
                gotra: user.gotra,
                rashi: user.rashi,
                nakshatra: user.nakshatra,
                gender: user.gender
            }
        });
    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(401).json({ error: 'Invalid Google Token' });
    }
};

exports.me = async (req, res) => {
    try {
        const user = req.user;
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            photo: user.photo,
            dob: user.dob,
            pob: user.pob,
            gotra: user.gotra,
            rashi: user.rashi,
            nakshatra: user.nakshatra,
            gender: user.gender,
            isProfileComplete: user.isProfileComplete
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        // Allow updating all profile fields
        const updates = req.body;

        // Ensure critical fields flag profile as complete
        const isProfileComplete = true; // Simplified: if they submit this form, it's complete

        const user = await User.findByIdAndUpdate(
            req.userId,
            { ...updates, isProfileComplete },
            { new: true }
        );

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            photo: user.photo,
            dob: user.dob,
            pob: user.pob,
            gotra: user.gotra,
            rashi: user.rashi,
            nakshatra: user.nakshatra,
            gender: user.gender,
            isProfileComplete: user.isProfileComplete
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
