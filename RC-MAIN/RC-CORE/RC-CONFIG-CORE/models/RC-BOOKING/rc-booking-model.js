const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  // Geetting the User Id 
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false
  },

  // Getting the Installer Id
  installer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Installer',
    required: false
  },

  // Getting the Address Detials 
  addressLine1: {
    type: String,
  },
  addressLine2: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip: {
    type: String
  },

  // Getting the Primary Service Id : Customer Perspective
  primaryService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false
  },

  // Getting the Secondary Service List of Id : installer Perspective
  secondaryServiceList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: false
    }
  ],

  // Getting the time_start
  time_start: {
    type: String,
    required: true
  },
  // Getting the time_end
  time_end: {
    type: String,
    required: true
  },
  // Getting the date
  date: {
    type: Date,
    required: true
  },
  // Getting the Labor rates and the material cost
  price_installer: {
    type: String,
    default: 0
  },
  material_cost: {
    type: String,
    default: 0
  },
  // Getting the cost shown to the customer
  customerShowingCost: {
    type: Number,
  },
  number_of_installs: {
    type: Number,
  },
  material_details: [
    {
      type: Array
    }],
  customer_paid :{
    status : {
      type: Boolean,
      default: false
    },
    amount : {
      type: Number,
      default: 0
    },
    payment_id : {
      type: String
    },
    client_secret : {
      type: String
    }
  },
  rc_payment_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  houseBuiltYear:{
    type:String
  },
  upgradeToNema:{
    type:Boolean
  },
  isOwner:{
    type:Boolean
  },
  veichle_details:[
    {
      make:{
        type:String
      },
      model:{
        type:String
      },
      yearOfManufacturing:{
        type:String
      }
    }
  ],
  chargers: [
    {
      cd2_1: {
        type: String
      },
      cd2_1a: {
        type: String
      },
      cd2_2a: {
        type: String,
        default: false
      },
      cd2_4: {
        type: String
      },
      cd2_5d: {
        type: String,
        default: false
      },
      cd2_8: {
        type: String
      },
      cd2_5c: {
        type: String
      },
      cd2_6: {
        type: String
      },
      cd2_6a: {
        type: String
      },
      cd2_7: {
        type: String
      },
      cd2_10: {
        type: String
      },
      cd2_12: {
        type: String
      },
      cd2_13: {
        type: String
      },
      cd2_9: {
        type: String
      },
      cd2_14: {
        type: String
      }
    }
  ],


  // This is for the I have Arrived
  completion_steps:{
    stage_0:{
      status_installer:{
        type:String,
        default:0
      },
      status_customer:{
        type:String,
        default:0
      },
      rating:{
        type:Number,
        default:0
      }
    },

// This is for the I have Started the Job 
    stage_1:{
      status_installer:{
        type:String,
        default:0
      },
      status_customer:{
        type:String,
        default:0
      },
      rating:{
        type:Number,
        default:0
      }
    },
  // This is for the Mark As Pending Complete 
    stage_2:{
      status_installer:{
        type:String,
        default:0
      },
      status_customer:{
        type:String,
        default:0
      },
      rating:{
        type:Number,
        default:0
      }
    },
// This are for the two cases , where Job gets either Prooted from  Pending Complete to Complete Complte , or the Job is directly Completed 
    overall_completion:{
      status_installer:{
        type:String,
        default:0
      },
      status_customer:{
        type:String,
        default:0
      },
      rating:{
        type:Number,
        default:0
      }
    },
    // Here Pending-Unapproved and Complete-Unapproved are those two staes which are Invoked by the Installer when they have completed the job
    job_status:{
      type:String,
      enums : ["LIVE","PENDING","COMPLETE","CANCELLED","MODIFIED","PENDING-UNAPPROVED" ,"COMPLETE-UNAPPROVED"],
      default:"LIVE"
    },
    job_rescheduled:{
      type:String,
      default:false
    }
  }

});


const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;