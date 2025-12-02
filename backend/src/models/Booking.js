const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    poojaId: { type: String, required: true },
    templeId: { type: String, required: true },
    date: { type: String, required: true },
    slotId: { type: String, required: true },
    addOnIds: [String],
    amountINR: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    inputs: {
        gotra: String,
        nakshatra: String,
        intentions: String
    },
    liveStreamUrl: String,
    recordingUrl: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
