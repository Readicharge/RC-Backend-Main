const { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } = process.env;

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const createUser = async (idata) => {
    try {
        const user = await stripe.customers.create({
            name: idata.name,
            email: idata.email,
        });

        return {
            status: 200,
            odata: user
        }
    }
    catch (error) {
        console.log(error);
        return {
            status: 500,
            odata: error.message
        }
    }
}


const createNewCardToken = async (idata) => {
    try {
        const {
            card_Name,
            card_Number,
            card_exp_month,
            card_exp_year,
            card_cvv
        } = idata;

        console.log(idata)

        const card_token = await stripe.tokens.create({
            card: {
                name: card_Name,
                number: card_Number,
                exp_year: card_exp_year,
                exp_month: card_exp_month,
                cvc: card_cvv
            }
        });
        
    
        return {
            status: 200,
            odata: card_token.id
        }
    }
    catch (error) {
        console.log(error);
        return {
            status: 500,
            odata: error.message
        }

    }
}


const hold_payment_on_card = async (idata) => {
    try {
        const { customerId,card_token, amount } = idata; // here Booking Id will be added 
        console.log(idata)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe requires the amount in cents
            currency: 'usd', // Change to your desired currency
            payment_method_data: {
                type: 'card',
                card: {
                    token: card_token,
                  },
            },
            confirm: true,
            capture_method: 'manual', // Hold the funds but don't capture immediately
            customer : customerId
        });

        return {
            status : 200,
            odata : paymentIntent
        }

    }
    catch (error) {
        console.log(error);
        return {
            status: 500,
            odata: error.message
        }
    }

}



const refund_payment_with_charge = async (idata) => {
    try { 
 // Getting the parameters fromt the input object
 const {paymentId,amount_to_be_charged} = idata;

 const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

 const amount_to_be_refunded = paymentIntent.amount - amount_to_be_charged;

 await stripe.paymentIntents.capture(paymentIntent.id,{amount_to_capture:amount_to_be_charged}
 );

 return {
     status:200,
     odata:amount_to_be_refunded
 }
    }
    catch (error) {
        return {
            status : 500,
            odata: error.message
        }
    }

}

module.exports = {
    createUser, 
    createNewCardToken,
    hold_payment_on_card,
    refund_payment_with_charge
}


