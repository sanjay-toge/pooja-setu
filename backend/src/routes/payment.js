const express = require('express');
const router = express.Router();
const instamojo = require('../services/instamojo');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// Initiate Payment
router.post('/initiate', async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ error: 'Booking ID is required' });
        }

        const booking = await Booking.findOne({ id: bookingId }).populate('poojaId');
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Normally we would get user details here, assuming booking has minimal user info or we fetch user
        // For now, using placeholders or data from booking if available
        // Note: In a real app, ensure email/phone are valid

        const paymentData = {
            purpose: `Booking: ${booking.id}`, // Only ASCII characters allowed usually
            amount: booking.amountINR,
            buyer_name: booking.inputs?.name || 'Devotee',
            email: 'sanjaystoge@gmail.com', // Placeholder or use req.user.email if authenticated
            phone: '9999999999', // Placeholder
            redirect_url: `http://localhost:3000/api/payment/callback`,
            webhook: `http://localhost:3000/api/payment/webhook`,
            allow_repeated_payments: false,
        };

        const result = await instamojo.createPaymentRequest(paymentData);

        // Save payment request ID to booking
        booking.paymentRequestId = result.id;
        await booking.save();

        res.json({
            paymentUrl: result.longurl,
            paymentRequestId: result.id
        });

    } catch (error) {
        console.error('Payment initiation failed:', error);
        res.status(500).json({ error: 'Failed to initiate payment', details: error.message });
    }
});

// Callback from Instamojo (User Redirect)
router.get('/callback', async (req, res) => {
    const { payment_id, payment_request_id, payment_status } = req.query;

    console.log('Payment Callback:', req.query);

    // Verify payment status (optional double check via API)
    // Update booking status
    if (payment_status === 'Credit') {
        try {
            // Find booking by paymentRequestId (assuming we saved it, or we need to pass bookingId in custom field if API supports)
            // Since we didn't save it in schema (yet), let's assume valid. 
            // Ideally we find the booking that matches this request ID.
            const booking = await Booking.findOneAndUpdate(
                { paymentRequestId: payment_request_id },
                { status: 'confirmed' }, // Mark booking as confirmed
                { new: true }
            );

            if (booking) console.log(`Booking ${booking.id} confirmed via Callback`);

        } catch (e) {
            console.error('Error updating booking on callback', e);
        }
    }

    // Redirect to App
    // Use a custom scheme or Universal Link
    // poojasetu://payment-success?status={status}&paymentId={id}
    // const appRedirectUrl = `poojasetu://payment-success?status=${payment_status}&paymentId=${payment_id}`;

    // For now, redirecting to a simple HTML page that opens the app or shows success
    // Or redirect to localhost:8081 if running web, but for mobile app deep linking is key.

    // Simpler approach for now:
    res.send(`
        <html>
            <body>
                <h1>Payment ${payment_status}</h1>
                <p>Redirecting to app...</p>
                <script>
                    // Valid deep link for Expo/React Native
                    // Attempt to open the app
                     window.location.href = "poojasetu://payment-success/${payment_request_id}"; // Just using ID for now
                     setTimeout(function() {
                         window.location.href = "poojasetu://(tabs)/bookings"; // Fallback
                     }, 3000);
                </script>
            </body>
        </html>
    `);
});

// Webhook (Server to Server)
router.post('/webhook', async (req, res) => {
    try {
        const data = req.body;
        console.log('Payment Webhook:', data);

        // Verify MAC (Message Authentication Code) if critical
        // const mac = data.mac; 

        if (data.status === 'Credit') {
            const booking = await Booking.findOneAndUpdate(
                { paymentRequestId: data.payment_request_id },
                { status: 'confirmed' }
            );
            if (booking) console.log(`Booking ${booking.id} confirmed via Webhook`);
        }
        res.send('OK');
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).send('Error');
    }
});

module.exports = router;
