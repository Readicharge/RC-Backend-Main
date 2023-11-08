




const create_customer_refund = async (req,res) => {

    // Step 1 : Getting the necessary inputs for the Refund Process
    const {bookingId ,condition} = req.body;

    // Step 2 : Getting the Booking Job from the booking Id
    const booking = await Booking.findById(bookingId);

    // Validation 
    if(!booking) res.json(404).json({odata:"No Such Booking Found"});

    // Step 3 : Getting the Payment Intent Id from the Booking Fetched
    const paymentIntentId = booking.payment_intent_id;

    // Step 4 : Getting the Amount of Booking 
    const initialAmount = booking.amountCustomer;

    // Step 5: Matching the Conditons for getting the Amount which has to be charged 
    var amount_to_be_charged = 0; // Initially Initializing at 0

    // Algorithm to get the amount to be charged goes here

    

    const refund_amount = await refund_payment_with_charge({paymentId:paymentIntentId,amount_to_be_charged:amount_to_be_charged});

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
