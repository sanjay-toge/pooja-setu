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
    serviceMode: {
        type: String,
        enum: ['online', 'offline'],
        default: 'online'
    },
    deliveryAddress: {
        line1: String,
        city: String,
        state: String,
        pincode: String
    },
    inputs: {
        gotra: String,
        nakshatra: String,
        intentions: String
    },
    paymentRequestId: String,
    liveStreamUrl: String,
    recordingUrl: String,
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Booking', bookingSchema);
