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
  addressLine1:{
    type:String,
    required:true
  },
  addressLine2:{
    type:String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  zip:{
    type:String,
    required:true
  }
});
 const ChargerBuy = mongoose.model('ChargerBuy', chargerBuySchema);
 module.exports = ChargerBuy;