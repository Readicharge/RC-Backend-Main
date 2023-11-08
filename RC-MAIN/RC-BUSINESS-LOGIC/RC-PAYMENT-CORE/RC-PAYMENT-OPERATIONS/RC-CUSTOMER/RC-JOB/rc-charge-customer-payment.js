const { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } = process.env;

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const charge_payment_for_job = async (req, res) => {
    try {
        const { hold_amount_transaction_id } = req.body;
        const paymentIntent = await stripe.paymentIntents.capture(hold_amount_transaction_id);

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