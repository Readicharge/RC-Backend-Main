const { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } = process.env;
const Booking = require('../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-BOOKING/rc-booking-model');

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const charge_payment_for_job = async (req, res) => {
    try {
        const { booking_id } = req.body;
        const booking = await Booking.findOne({ _id: booking_id });

        const paymentIntent = await stripe.paymentIntents.capture(booking.customer_paid.payment_id);

        if (paymentIntent.status === "succeeded") {
            res.status(200).json({ odata: paymentIntent });
        }
        else {
            res.status(400).json({ odata: "Not able to get the payment" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err })
    }

}


module.exports = {
    charge_payment_for_job
}