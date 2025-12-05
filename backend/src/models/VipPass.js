const mongoose = require('mongoose');

const vipPassSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    templeId: {
        type: String,
        required: true
    },
    templeName: {
        type: String,
        required: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    timeSlot: {
        type: String,
        enum: ['morning', 'afternoon', 'evening'],
        required: true
    },
    timeRange: {
        type: String, // e.g., "6:00 AM - 9:00 AM"
        required: true
    },
    amountPaidINR: {
        type: Number,
        required: true
    },
    qrCodeData: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'used', 'expired', 'cancelled'],
        default: 'active'
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    validatedAt: {
        type: Date
    },
    validatedBy: {
        type: String // Staff member who scanned
    }
}, {
    timestamps: true
});

// Index for efficient querying
vipPassSchema.index({ userId: 1, status: 1 });
vipPassSchema.index({ qrCodeData: 1 });
vipPassSchema.index({ date: 1, timeSlot: 1 });

module.exports = mongoose.model('VipPass', vipPassSchema);
