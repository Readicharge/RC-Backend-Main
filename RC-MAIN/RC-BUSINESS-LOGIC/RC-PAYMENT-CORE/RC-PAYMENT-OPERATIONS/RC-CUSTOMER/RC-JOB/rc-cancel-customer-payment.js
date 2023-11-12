const { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } = process.env;
const Booking = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-BOOKING/rc-booking-model");

const stripe = require('stripe')(STRIPE_SECRET_KEY);



const cancel_payment_for_job = async (req, res) => {
    try {
        const { booking_id } = req.body; // Here we need the transaction Id itself , but we will not take that into account , for the ease and better security we will pass the booking id 
        
        console.log(booking_id)
        const booking = await Booking.findById(booking_id);
       
       
        const paymentIntent = await stripe.paymentIntents.cancel(booking.customer_paid.payment_id);

        if (paymentIntent.status === "canceled") {
            res.status(200).json({ odata: paymentIntent });
        }
        else {
            console.log(res.data);
            res.status(400).json({ odata: "Not able to Cencel the payment" });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something Unexpected Happended here, Please try again to cancel the Job " })
    }

}


module.exports = {
    cancel_payment_for_job
}