// Here we need to make the function which will help us to transfer the payments to the desired Installer bank acount



require('dotenv').config();
const Installer = require('../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/rc-installer-model');
const Payment = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-PAYMENT/rc-payment-model")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



async function initiatePayment(amount, installerDetails) {
    try {
      // Create a card token
      const cardToken = await stripe.tokens.create({
        card: {
          number: '4242424242424242', // Replace with a valid card number
          exp_month: 12, // Replace with a valid expiration month
          exp_year: 2024, // Replace with a valid expiration year
          cvc: '123', // Replace with a valid CVC
        },
      });
  
      // Create a payment method
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: cardToken.id,
        },
      });
  
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount*100,
        currency: 'usd',
        payment_method_types: ['card'],
        transfer_data: {
          destination: installerDetails.id,
          amount: amount*100,
        },
        payment_method: paymentMethod.id, // Attach the payment method to the PaymentIntent
      });
  
      console.log(paymentIntent);
  
      // Confirm the payment intent
      const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);
  
      // Return the confirmed payment intent
      return confirmedPaymentIntent;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw new Error('Failed to initiate payment');
    }
  }
  


const transfer_payment =  async (userId,amount) => {
   
        try {
            // Retrieve the installer details from the database
            console.log(amount,"amount")
            const installerDetails = await Installer.findById(userId);
            console.log(installerDetails.stripePaymentDetails)
            // Check if installer details exist
            if (!installerDetails) {
              return res.status(404).json({ error: 'Installer details not found' });
            }
        
            const today = new Date()
            // Initiate the payment
            const paymentResult = await initiatePayment(amount, installerDetails.stripePaymentDetails);

            const idata = {
              payment_type:"booking",
              seen:"false",
              isIncoming:"true",
              client_secret:installerDetails.stripePaymentDetails.id,
              payment_id:paymentResult.id,
              installer_id:userId,
              amount:amount,
              date:today
            }

            const paymentObj = new Payment(idata);
            await paymentObj.save();
        
            // Return the payment result
            return paymentResult;
          } catch (error) {
            console.log(error)
           return null;
          }
  };



  module.exports = {
    transfer_payment
  }
