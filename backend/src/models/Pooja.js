const mongoose = require('mongoose');

const poojaSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    templeId: { type: String, required: true },
    basePriceINR: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    type: String,
    addOns: [{
        id: String,
        name: String,
        priceINR: Number
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pooja', poojaSchema);
