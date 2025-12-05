const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/poojasetu')
    .then(async () => {
        console.log('MongoDB connected\n');

        const VipPass = mongoose.model('VipPass', new mongoose.Schema({}, { strict: false }));

        const passes = await VipPass.find({});

        console.log(`Total VIP passes: ${passes.length}\n`);

        if (passes.length > 0) {
            passes.forEach((pass, i) => {
                console.log(`${i + 1}. ${pass.templeName} - ${pass.timeSlot} - Status: ${pass.status} - Date: ${pass.date}`);
            });
        } else {
            console.log('No VIP passes found in database');
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
