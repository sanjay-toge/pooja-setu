const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
        } else if (method === 'google' || method === 'facebook') {
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
                pob: user.pob
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            pob: user.pob
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, dob, pob } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, email, dob, pob },
            { new: true }
        );

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            photo: user.photo,
            dob: user.dob,
            pob: user.pob
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
