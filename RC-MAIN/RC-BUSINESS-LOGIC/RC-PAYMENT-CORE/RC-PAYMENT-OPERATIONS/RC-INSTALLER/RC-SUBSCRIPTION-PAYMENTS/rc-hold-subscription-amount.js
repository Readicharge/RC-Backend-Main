const { createUser, createNewCardToken, hold_payment_on_card } = require("../../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-PAYMENT/rc-payment-controller-main");
const Installer = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/rc-installer-model");
const Payment = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-PAYMENT/rc-payment-model");

// Here Customer ~ Installer ; Reason : they are treated as customer to stripe 


const hold_payment_for_subscription = async (req, res) => {
    try {
        const {
            installer_name,
            installer_email,
            amount,
            card_number,
            cvv,
            card_expiration,
            subscription_type, // Referral_Monthly . Referral_Annual . Priority_Monthly , Priority_Annual
        } = req.body;

        // Step 1 : Create the Customer on the Stripe 

        const customer_on_stripe = await createUser(
            {
                name: installer_name,
                email: installer_email
            });

        // If the Customer is successfully created on the Stripe the Proceed

        if (customer_on_stripe.status === 200) {
            // Step 2 : Add the Card to the Customer on the Stripe

            const card_on_stripe = await createNewCardToken({
                card_Name: installer_name,
                card_Number: card_number,
                card_exp_month: card_expiration.split("/")[0],
                card_exp_year: card_expiration.split("/")[1],
                card_cvv: cvv
            })

            // If the Card is Succeddfully added to the Stripe , then Proceed
            if (card_on_stripe.status === 200) {
                // Step 3 : Charge the amount from the card , and keep it on hold on the card itself 
                const hold_amount_on_customer_card = await hold_payment_on_card({
                    customerId: customer_on_stripe.odata.id, card_token: card_on_stripe.odata, amount: amount
                })
                if (hold_amount_on_customer_card.status === 200) {


                    const currentDate = new Date();

                    // Creating the Payment Intent 
                    const payment = new Payment({
                        payment_type: subscription_type,
                        isIncoming: true, // Installer Perspective
                        client_secret: hold_amount_on_customer_card.odata.client_secret,
                        payment_id: hold_amount_on_customer_card.odata.id,
                        installer_id: req.params.installerId,
                        date: currentDate,
                        amount: amount,
                    });

                    // Saving the Intents 
                    await payment.save(payment);

                    // Here based on the type of the Intent the Installer Next date for the subscription is selected 
                    if (subscription_type === "Referral_Monthly") {
                        const installer = await Installer.findById(req.params.installerId);
                        console.log(installer)
                        installer.monthySubscribed_Referral.last_transaction_id = paymentIntentId;
                        installer.monthySubscribed_Referral.status = true;
                        // Set the start_date as the current date
                        installer.monthySubscribed_Referral.start_date = new Date();
                        // Set the end_date as one month after the start_date
                        installer.monthySubscribed_Referral.end_date = new Date(installer.monthySubscribed_Referral.start_date);
                        installer.monthySubscribed_Referral.end_date.setMonth(installer.monthySubscribed_Referral.end_date.getMonth() + 1);
                        await installer.save();
                    }
                    else if (subscription_type === "Referral_Annual") {
                        const installer = await Installer.findById(req.params.installerId);
                        console.log(installer)
                        installer.annualSubscribed_Referral.last_transaction_id = paymentIntentId;
                        installer.annualSubscribed_Referral.status = true;
                        // Set the start_date as the current date
                        installer.annualSubscribed_Referral.start_date = new Date();
                        // Set the end_date as one year after the start_date
                        installer.annualSubscribed_Referral.end_date = new Date(installer.annualSubscribed_Referral.start_date);
                        installer.annualSubscribed_Referral.end_date.setFullYear(installer.annualSubscribed_Referral.end_date.getFullYear() + 1);
                        await installer.save();
                    }
                    else if (subscription_type === "Priority_Monthly") {
                        const installer = await Installer.findById(req.params.installerId);
                        console.log(installer)
                        installer.monthySubscribed_Priority.last_transaction_id = paymentIntentId;
                        installer.monthySubscribed_Priority.status = true;
                        // Set the start_date as the current date
                        installer.monthySubscribed_Priority.start_date = new Date();
                        // Set the end_date as one month after the start_date
                        installer.monthySubscribed_Priority.end_date = new Date(installer.monthySubscribed_Priority.start_date);
                        installer.monthySubscribed_Priority.end_date.setMonth(installer.monthySubscribed_Priority.end_date.getMonth() + 1);
                        await installer.save();
                    }
                    else if (subscription_type === "Priority_Annual") {
                        const installer = await Installer.findById(req.params.installerId);
                        console.log(installer)
                        installer.annualSubscribed_Priority.last_transaction_id = paymentIntentId;
                        installer.annualSubscribed_Priority.status = true;
                        // Set the start_date as the current date
                        installer.annualSubscribed_Priority.start_date = new Date();
                        // Set the end_date as one year after the start_date
                        installer.annualSubscribed_Priority.end_date = new Date(installer.annualSubscribed_Priority.start_date);
                        installer.annualSubscribed_Priority.end_date.setFullYear(installer.annualSubscribed_Priority.end_date.getFullYear() + 1);
                        await installer.save();
                    }


                    // If the Amount is succefully captured in the Card ,then return success
                    res.status(200).json(hold_amount_on_customer_card);
                }
                else {
                    res.status(500).json({ odata: "Amount not able to hold on card" });
                }
            }
            else {
                res.status(500).json({ odata: "Not able to add the card to Stripe" });
            }
        }
        else {
            res.statu(500).json({ odata: "Not able to create the customer" });
        }


    }
    catch (error) {
        console.log(error)
        res.status(500).json({ odata: "Amount not able to hold on card" })
    }
}



module.exports = {
    hold_payment_for_subscription
}