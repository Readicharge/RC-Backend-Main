// importing the express 
const express = require('express');
// importing the cros
const cors = require('cors');
// importing the dotenv
require("dotenv").config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// crreating the app 
const app = express();
app.use(express.json());
app.use(cors());
// Defining the Port


const apiRoutes = require("./RC-MAIN/RC-CORE/RC-MASTER_ROUTES-CORE/rc-master-routes");



// Middleware
app.get('/',(req,res) =>
{
   res.json({message:"api running.."})
   
})

// Mongodb connection 
const connectDB = require("./RC-MAIN/RC-CORE/RC-AUTH-CORE/db");
connectDB();





// Middleware 
app.use('/api',apiRoutes);


// error handeling middleware
app.use((error,req,res,next)=>{
    console.log("error")
    res.status(500).json({
        message:error.message,
        stack:error.stack
    })
    next(error)
})


app.listen(process.env.PORT , ()=>{
    console.log(`Port Startd and Working on Port : ${process.env.PORT}`)
})
