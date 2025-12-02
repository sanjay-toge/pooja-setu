const Booking = require('../models/Booking');
const dayjs = require('dayjs');

exports.createBooking = async (req, res) => {
    try {
        const bookingData = {
            ...req.body,
            userId: req.userId,
            status: 'pending'
        };

        const booking = await Booking.create(bookingData);

        // Simulate live stream URL generation
        const liveStreamUrl = `https://stream.poojasetu.com/live/${booking._id}`;
        booking.liveStreamUrl = liveStreamUrl;
        await booking.save();

        res.json({
            id: booking._id,
            ...booking.toObject()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if booking time is near (within 30 minutes before or during the pooja)
        const bookingDateTime = dayjs(`${booking.date} ${booking.slotId.split('-')[0]}`, 'YYYY-MM-DD HH:mm');
        const now = dayjs();
        const minutesUntilStart = bookingDateTime.diff(now, 'minutes');
        const minutesSinceStart = now.diff(bookingDateTime, 'minutes');

        let streamStatus = 'upcoming';
        if (minutesUntilStart <= 30 && minutesSinceStart < 120) {
            streamStatus = 'live';
            booking.status = 'confirmed';
            await booking.save();
        } else if (minutesSinceStart >= 120) {
            streamStatus = 'completed';
            booking.status = 'completed';
            // Add recording URL for completed bookings
            if (!booking.recordingUrl) {
                booking.recordingUrl = `https://stream.poojasetu.com/recording/${booking._id}`;
                await booking.save();
            }
        }

        res.json({
            ...booking.toObject(),
            streamStatus
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
