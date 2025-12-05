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
        morningSlot: {
            priceINR: { type: Number, default: 0 },
            timeRange: { type: String, default: '6:00 AM - 9:00 AM' }
        },
        afternoonSlot: {
            priceINR: { type: Number, default: 0 },
            timeRange: { type: String, default: '12:00 PM - 3:00 PM' }
        },
        eveningSlot: {
            priceINR: { type: Number, default: 0 },
            timeRange: { type: String, default: '5:00 PM - 8:00 PM' }
        }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Temple', templeSchema);
