const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  payment_type: {
    type: String,
    enum: ['booking', 'Referral_Monthly','Referral_Annual','Priority_Monthly','Priority_Annual', 'purchase'],
    required: true,
  },
  seen:{
    type:Boolean,
    default:false
  },
  isIncoming:{
    type:Boolean,
    default:false
  },
  sequence_number:{
    type: Number,
  },
  client_secret:{
    type: String,
    required: true
  },
  payment_id: {
    type: String,
    required: true
  },
  installer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Installer',
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  date:{
    type:Date,
    required:true
  },
  amount:{
    type:Number,
    required:true
  },
  Job_Id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Booking"
  },
  Job_Unique_Rc_id:{
   type:String,
  }

});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
