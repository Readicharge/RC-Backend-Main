const Booking = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-BOOKING/rc-booking-model");
const Payment = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-PAYMENT/rc-payment-model");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const refund_payment_with_charge = async (idata)=>{
    try {
     const {payment_id,amount_to_be_charged} = idata;
     const payment_intent = await Payment.findById(payment_id);
     const payment_intent_id = payment_intent.payment_id;
     const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
     // console.log(paymentIntent)
 
     const amount_to_be_refunded = paymentIntent.amount - (amount_to_be_charged*100);
     await stripe.paymentIntents.capture(paymentIntent.id,{amount_to_capture:amount_to_be_charged*100}
     );
   
 
 
     payment_intent.amount=amount_to_be_refunded;
     payment_intent.date = new Date();
     console.log(payment_intent)
     await payment_intent.save();
 
     return {status:200,odata:"Success"};
    } catch (error) {
     return {status:500,odata:error}
    }
 }

const create_customer_refund = async (req,res) => {

    // Step 1 : Getting the necessary inputs for the Refund Process
    const {bookingId,amount_to_be_charged } = req.body;

    // Step 2 : Getting the Booking Job from the booking Id
    const booking = await Booking.findById(bookingId);

    // Validation 
    if(!booking) res.status(404).json({odata:"No Such Booking Found"});

    // Step 3 : Getting the Payment Intent Id from the Booking Fetched
    const paymentIntentId = booking.rc_payment_id;



    // Algorithm to get the amount to be charged goes here
    

    

    const refund_amount = await refund_payment_with_charge({payment_id:paymentIntentId.toString(),amount_to_be_charged:amount_to_be_charged});
    console.log(refund_amount)

    if(refund_amount.status == 200) {
        res.status(200).json(refund_amount.odata);
    }
    else{
        res.status(500).json(refund_amount.odata);
    }

}


module.exports = {
    create_customer_refund
}





 