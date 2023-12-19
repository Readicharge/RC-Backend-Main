const mongoose = require('mongoose');
 const chargerBuySchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  payment_id: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  number_of_chargers:{
    type:Number,
    required:true
  },
  charger_reference_id:{
    type:String,
    required:true
  }
});
 const ChargerBuy = mongoose.model('ChargerBuy', chargerBuySchema);
 module.exports = ChargerBuy;