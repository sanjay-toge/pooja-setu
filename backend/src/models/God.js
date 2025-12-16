const mongoose = require('mongoose');

const godSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    teachings: [{ type: String }],
    purans: [{ type: String }], // Names of associated Puranas
    mantras: [{
        title: String,
        text: String,
        meaning: String
    }],
    stories: [{
        title: String,
        content: String
    }],
    topMandirs: [{
        name: String,
        location: String,
        description: String
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('God', godSchema);
