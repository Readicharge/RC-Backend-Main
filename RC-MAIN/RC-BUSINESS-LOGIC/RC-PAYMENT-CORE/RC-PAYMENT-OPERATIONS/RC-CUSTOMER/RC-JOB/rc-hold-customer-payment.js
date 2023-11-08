const { createUser, createNewCardToken, hold_payment_on_card } = require("../../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-PAYMENT/rc-payment-controller-main");



const hold_payment_for_job = async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            amount,
            card_number,
            cvv,
            card_expiration
        } = req.body;

        // Step 1 : Create the Customer on the Stripe 

        const customer_on_stripe = await createUser(
            {
                name: customer_name,
                email: customer_email
            });

        // If the Customer is successfully created on the Stripe the Proceed

        if (customer_on_stripe.status === 200) {
            // Step 2 : Add the Card to the Customer on the Stripe

            const card_on_stripe = await createNewCardToken({
                card_Name: customer_name,
                card_Number: card_number,
                card_exp_month: card_expiration.split("/")[0],
                card_exp_year: card_expiration.split("/")[1],
                card_cvv: cvv
            })

            // If the Card is Succeddfully added to the Stripe , then Proceed
            if (card_on_stripe.status === 200) {

                // Step 3 : Charge the amount from the card , and keep it on hold on the card itself 
                const hold_amount_on_customer_card = await hold_payment_on_card({
                   customerId:customer_on_stripe.odata.id, card_token: card_on_stripe.odata, amount: amount
                })
                if (hold_amount_on_customer_card.status === 200) {
                    // If the Amount is succefully captured in the Card ,then return success
                    res.status(200).json(hold_amount_on_customer_card);
                }
                else {
                    res.status(500).json({ odata: "Amount not able to hold on card" });
                }
            }
            else {
                res.status(500).json({ odata: "Not able to add the card to Stripe"});
            }
        }
        else {
            res.statu(500).json({ odata: "Not able to create the customer" });
        }
    }
    catch (error) {
        res.status(500).json({ odata: "Amount not able to hold on card" })
    }

}

module.exports = {
    hold_payment_for_job
}