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
        const { templeId, templeName, date, timeSlot, timeRange, amountPaidINR } = req.body;
        const userId = req.userId;

        // Validate required fields
        if (!templeId || !templeName || !date || !timeSlot || !timeRange || !amountPaidINR) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already has a pass for this temple/date/slot
        const existing = await VipPass.findOne({
            userId,
            templeId,
            date,
            timeSlot,
            status: { $in: ['active', 'used'] }
        });

        if (existing) {
            return res.status(400).json({ error: 'You already have a VIP pass for this slot' });
        }

        // Generate unique QR code
        const qrCodeData = generateQRCode(userId, templeId, date, timeSlot);

        // Create VIP pass
        const vipPass = await VipPass.create({
            userId,
            templeId,
            templeName,
            date,
            timeSlot,
            timeRange,
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

        const passes = await VipPass.find(query).sort({ date: -1, timeSlot: 1 });

        // Update expired passes
        const now = new Date();
        for (const pass of passes) {
            if (pass.status === 'active' && new Date(pass.date) < now) {
                pass.status = 'expired';
                await pass.save();
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
