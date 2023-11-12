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
  }
  // // Getting the Charger Details
  // charger_details: [
  //   {
  //     model: {
  //       type: String
  //     },
  //     type: {
  //       type: String
  //     },
  //     Charger_received_by: {
  //       type: Date
  //     },
  //     exsisting_outlet: {
  //       type: String
  //     },
  //     upgraded_to_nema: {
  //       type: String,
  //       default: false
  //     },
  //     charger_location: {
  //       type: String
  //     },
  //     attached_home: {
  //       type: String,
  //       default: false
  //     },
  //     electrical_panel_location: {
  //       type: String
  //     },
  //     floor: {
  //       type: String
  //     },
  //     interior_wall_finish: {
  //       type: String
  //     },
  //     exterior_wall_finish: {
  //       type: String
  //     },
  //     wall_construction: {
  //       type: String
  //     },
  //     electrical_panel_type: {
  //       type: String
  //     },
  //     panel_brand: {
  //       type: String
  //     },
  //     main_breaker_size: {
  //       type: String
  //     },
  //     gretater_equal: {
  //       type: String
  //     },
  //     open_breakersL: {
  //       type: String
  //     },
  //     recessed_panel: {
  //       type: String
  //     },
  //     distance_panel: {
  //       type: String
  //     }
  //   }
  // ],
  // Getting te Completeion Steps 


});


const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;