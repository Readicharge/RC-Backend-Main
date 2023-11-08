const { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } = process.env;

const stripe = require('stripe')(STRIPE_SECRET_KEY);



const cancel_payment_for_job = async (req, res) => {
    try {
        const { hold_amount_transaction_id } = req.body;
        const paymentIntent = await stripe.paymentIntents.cancel(hold_amount_transaction_id);

        if (paymentIntent.status === "canceled") {
            res.status(200).json({ odata: paymentIntent });
        }
        else {
            res.status(400).json({ odata: "Not able to Cencel the payment" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Not able to Cancel the amount" })
    }

}


module.exports = {
    cancel_payment_for_job
}