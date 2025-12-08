const VipPass = require('../models/VipPass');
const crypto = require('crypto');

// Generate unique QR code data
function generateQRCode(userId, templeId, date, timeSlot) {
    const data = `${userId}-${templeId}-${date}-${timeSlot}-${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Purchase VIP pass
exports.purchaseVipPass = async (req, res) => {
    try {
        const { templeId, templeName, date, startTime, amountPaidINR } = req.body;
        const userId = req.userId;

        // Validate required fields
        if (!templeId || !templeName || !date || !startTime || !amountPaidINR) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Calculate end time (1 hour after start time)
        const [hours, minutes] = startTime.split(':').map(Number);
        const endHour = (hours + 1) % 24;
        const endTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        // Check if user already has a pass for this temple/date/time
        const existing = await VipPass.findOne({
            userId,
            templeId,
            date,
            startTime,
            status: { $in: ['active', 'used'] }
        });

        if (existing) {
            return res.status(400).json({ error: 'You already have a VIP pass for this time' });
        }

        // Generate unique QR code
        const qrCodeData = generateQRCode(userId, templeId, date, startTime);

        // Create VIP pass
        const vipPass = await VipPass.create({
            userId,
            templeId,
            templeName,
            date,
            startTime,
            endTime,
            amountPaidINR,
            qrCodeData,
            status: 'active'
        });

        res.json({
            id: vipPass._id,
            ...vipPass.toObject()
        });
    } catch (error) {
        console.error('Purchase VIP pass error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get user's VIP passes
exports.getMyVipPasses = async (req, res) => {
    try {
        const userId = req.userId;
        const { status } = req.query;

        const query = { userId };
        if (status) {
            query.status = status;
        }

        const passes = await VipPass.find(query).sort({ date: -1, startTime: 1 });

        // Update expired passes - check if end time has passed
        const now = new Date();
        for (const pass of passes) {
            if (pass.status === 'active') {
                // Parse pass end time
                const [endHour, endMinute] = pass.endTime.split(':').map(Number);
                const passDateTime = new Date(pass.date + 'T00:00:00');
                passDateTime.setHours(endHour, endMinute, 0, 0);

                // Mark as expired if end time has passed
                if (now > passDateTime) {
                    pass.status = 'expired';
                    await pass.save();
                }
            }
        }

        res.json(passes);
    } catch (error) {
        console.error('Get VIP passes error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get specific VIP pass by ID
exports.getVipPassById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const pass = await VipPass.findOne({ _id: id, userId });

        if (!pass) {
            return res.status(404).json({ error: 'VIP pass not found' });
        }

        res.json(pass);
    } catch (error) {
        console.error('Get VIP pass error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Validate VIP pass (for temple staff scanning)
exports.validateVipPass = async (req, res) => {
    try {
        const { qrCodeData } = req.body;

        const pass = await VipPass.findOne({ qrCodeData });

        if (!pass) {
            return res.status(404).json({ error: 'Invalid QR code' });
        }

        if (pass.status === 'used') {
            return res.status(400).json({
                error: 'This pass has already been used',
                usedAt: pass.validatedAt
            });
        }

        if (pass.status === 'expired' || pass.status === 'cancelled') {
            return res.status(400).json({ error: 'This pass is no longer valid' });
        }

        // Check if pass is for today
        const today = new Date().toISOString().split('T')[0];
        if (pass.date !== today) {
            return res.status(400).json({ error: 'This pass is not valid today' });
        }

        // Mark pass as used
        pass.status = 'used';
        pass.validatedAt = new Date();
        pass.validatedBy = req.body.staffName || 'Temple Staff';
        await pass.save();

        res.json({
            success: true,
            message: 'VIP pass validated successfully',
            pass: {
                templeName: pass.templeName,
                timeSlot: pass.timeSlot,
                timeRange: pass.timeRange,
                validatedAt: pass.validatedAt
            }
        });
    } catch (error) {
        console.error('Validate VIP pass error:', error);
        res.status(500).json({ error: error.message });
    }
};
