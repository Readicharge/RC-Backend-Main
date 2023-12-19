const ChargerBuy = require("../../../../RC-CORE/RC-CONFIG-CORE/models/RC-CHARGER/rc-charger-model");



const chargerBuy = async (req,res) => {
    try{
        const {customer_id,payment_id,price,number_of_chargers, addressLine1, addressLine2, city , state, zip} = req.body;
        const newChargerBuy = await ChargerBuy.create({customer_id,payment_id,price,number_of_chargers, addressLine1, addressLine2, city , state, zip});
        res.status(200).json({
            message:"Charger buy created successfully",
            newChargerBuy
        });
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json(error);
    }
}


module.exports = {
    chargerBuy
}