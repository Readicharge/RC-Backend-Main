// Impoting the Dotenv and Configuring it
require('dotenv').config();

// Importing the Mongoose
const mongoose = require('mongoose');


// Setting the Mongoose to Strict Mode
mongoose.set('strictQuery',true);

// Connecting to the Database
const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
    } catch (error) {
        // If the Error Occurs then Console Log the Error and Exit the Process to Trace the Database Connection Error
        console.log(error);
        process.exit(1);
    }
}

// Exporting the ConnectDB Function
module.exports = connectDb;