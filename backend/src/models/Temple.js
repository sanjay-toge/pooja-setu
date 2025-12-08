const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    description: String,
    heroImageUrl: String,
    rating: { type: Number, default: 4.5 },
    deities: [String],
    vipPricing: {
        enabled: { type: Boolean, default: false },
        priceINR: { type: Number, default: 0 }
    },
    openingTime: { type: String, default: '06:00' },
    closingTime: { type: String, default: '20:00' },
    liveDarshanUrl: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Temple', templeSchema);
