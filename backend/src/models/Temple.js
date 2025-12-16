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
    openingTime: String,
    closingTime: String,
    liveDarshanUrl: {
        type: String,
        default: ''
    },
    blogs: [{
        title: { type: String, required: true },
        excerpt: String,
        content: { type: String, required: true },
        author: { type: String, default: 'Temple Admin' },
        publishedDate: { type: Date, default: Date.now },
        imageUrl: String
    }],
    gallery: [{
        url: { type: String, required: true },
        caption: String,
        uploadedDate: { type: Date, default: Date.now }
    }],
    teachings: [{
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: {
            type: String,
            enum: ['mantra', 'story', 'philosophy', 'ritual'],
            default: 'story'
        },
        deity: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Temple', templeSchema);
