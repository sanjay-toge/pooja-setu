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

async function fixExpiredPasses() {
    try {
        console.log('Checking for wrongly expired passes...\n');

        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // Find all expired passes for today
        const expiredPasses = await VipPass.find({
            status: 'expired',
            date: today
        });

        console.log(`Found ${expiredPasses.length} expired passes for today`);

        const slotEndTimes = {
            'morning': 9,    // 6 AM - 9 AM
            'afternoon': 15, // 12 PM - 3 PM
            'evening': 20    // 5 PM - 8 PM
        };

        let fixed = 0;

        for (const pass of expiredPasses) {
            const slotEndHour = slotEndTimes[pass.timeSlot] || 9;
            const passDate = new Date(pass.date + 'T00:00:00');
            const slotEndTime = new Date(passDate);
            slotEndTime.setHours(slotEndHour, 0, 0, 0);

            // If slot hasn't ended yet, mark as active
            if (now <= slotEndTime) {
                pass.status = 'active';
                await pass.save();
                console.log(`✓ Fixed pass for ${pass.templeName} - ${pass.timeSlot} slot (${pass.timeRange})`);
                fixed++;
            } else {
                console.log(`✗ Pass for ${pass.templeName} - ${pass.timeSlot} slot has actually expired`);
            }
        }

        console.log(`\n✅ Fixed ${fixed} passes`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixExpiredPasses();
