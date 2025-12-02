const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    description: String,
    heroImageUrl: String,
    rating: { type: Number, default: 4.5 },
    deities: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Temple', templeSchema);
