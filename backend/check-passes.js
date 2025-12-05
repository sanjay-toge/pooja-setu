const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/poojasetu')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const vipPassSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    templeId: String,
    templeName: String,
    date: String,
    timeSlot: String,
    timeRange: String,
    amountPaidINR: Number,
    qrCodeData: String,
    status: String,
    purchaseDate: Date,
    validatedAt: Date,
    validatedBy: String
}, { timestamps: true });

const VipPass = mongoose.model('VipPass', vipPassSchema);

async function checkPasses() {
    try {
        console.log('Fetching all VIP passes...\n');

        const passes = await VipPass.find({}).sort({ purchaseDate: -1 }).limit(10);

        console.log(`Total passes found: ${passes.length}\n`);

        passes.forEach((pass, index) => {
            console.log(`Pass #${index + 1}:`);
            console.log(`  Temple: ${pass.templeName}`);
            console.log(`  Date: ${pass.date}`);
            console.log(`  Time Slot: ${pass.timeSlot} (${pass.timeRange})`);
            console.log(`  Status: ${pass.status}`);
            console.log(`  Purchased: ${pass.purchaseDate}`);
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkPasses();
