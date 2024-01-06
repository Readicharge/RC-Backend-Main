require('dotenv').config();
const axios = require('axios');
const Booking = require("../../../../RC-CORE/RC-CONFIG-CORE/models/RC-BOOKING/rc-booking-model");
const {updateStage0Rating , updateStage1Rating ,updateStage2Rating,calculateInstallerRating } = require("../../../RC-RATING/rc-installer-rating")



// helper Function for getting the Curent Time in the required format 
const getCurrentTimeWithSixDecimals = async ()=> {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Combine hours and minutes with six decimal places
    const currentTimeWithSixDecimals = hours + (minutes / 60).toFixed(6).substr(1);
  
    return parseFloat(currentTimeWithSixDecimals);
  }




// Case 1 : Handle I have arrived 
const handle_I_have_arrived = async (req,res) => {

    const booking_id = req.params.bookingId;
   //  Thouugh the req.body is passed but there is not need of it 

    const booking = await Booking.findById(booking_id);

    const date = new Date();
    const time = await getCurrentTimeWithSixDecimals();

    await updateStage0Rating(booking_id, time, date);
     
    console.log(booking)
    // Update the ability for the customer to modify the job scope 
    booking.completion_steps.job_modyfying_ability_to_customer= true;;
    booking.completion_steps.stage_0.status_installer = true;

    await booking.save();
   
    res.status(200).json({
        message: 'Installer has marked as arrived'
    });

}



// Case 2 : Handle I have started working
const handle_I_have_Started_the_Job = async (req,res) => {
    const booking_id = req.params.bookingId;
    //  Thouugh the req.body is passed but there is not need of it 

     const booking = await Booking.findById(booking_id);
     booking.completion_steps.stage_1.status_installer = true;
     await booking.save();

     const date = new Date();
     const time = await getCurrentTimeWithSixDecimals();

     await updateStage1Rating(booking_id, time, date);

    // //  The particular amount is charged from the bank account of the user
    // await axios.put(`${process.env.BASE_BACKEND_URL}/payments/complete-hold-transaction/${booking_id}/Job-ticket-booking`,{
    //     time: time,
    //     date: date
    //  });


     res.status(200).json({
        message: 'Installer has started his job'
    });
}


// Case 3 : Handle Mark Job as Complete Pending
const handle_Complete_Pending_Job = async (req,res) =>{

    const booking_id = req.params.bookingId;
    const booking = await Booking.findById(booking_id);

    const date = new Date();
    const time = await getCurrentTimeWithSixDecimals();

    await updateStage2Rating(booking_id,time,date);

    // const UserhasVerified = false //This is going to use this for the customer to verify || if the update is not coming since last 24 hours then automatically set to true
    // // Api call for releasing the material charge to the Installer
    // await axios.put(`${process.env.BASE_BACKEND_URL}/payments/transfer-funds/Installer/${booking.installer}`,{
    //     amount : booking.materialCost
    // });
    
    booking.completion_steps.stage_2.status_installer = true;
    booking.completion_steps.job_status = "PENDING-UNAPPROVED";
    await booking.save();

    res.status(200).json({
        message: 'Installer has marked that the job is pending complete'
    });
}


// Case 4 : Handle Mark Job as Complete Complete
const handle_Complete_Complete_job = async ( req,res ) => {
    const booking_id = req.params.bookingId;
    const booking = await Booking.findById(booking_id);
    // const {user_given_rating} = req.body;

    booking.completion_steps.stage_2.status_installer = true;
    booking.completion_steps.job_status = "COMPLETE-UNAPPROVED";


    const date = new Date();
    const time = await getCurrentTimeWithSixDecimals();

    await updateStage2Rating(booking_id,time,date);
    await calculateInstallerRating(booking_id);

    // await axios.put(`${process.env.BASE_BACKEND_URL}/rating/calculate_installer_rating/${booking_id}`,{
    //     userGivenRating:user_given_rating
    // });

    // const UserhasVerified = false //This is going to use this for the customer to verify || if the update is not coming since last 24 hours then automatically set to true
    // // Api call for releasing the material charge to the Installer
    // await axios.put(`${process.env.BASE_BACKEND_URL}/payments/transfer-funds/Installer/${booking.installer}`,{
    //     amount : booking.materialCost + booking.labourRates
    // });

    res.status(200).json({
        message: 'Installer has marked that the job is Complete complete'
    });
}


// Case 5 : Handle Accept Modify Edited Job




module.exports = {
    handle_I_have_arrived,
    handle_I_have_Started_the_Job,
    handle_Complete_Pending_Job,
    handle_Complete_Complete_job
}