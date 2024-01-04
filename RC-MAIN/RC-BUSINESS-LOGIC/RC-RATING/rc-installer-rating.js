const Booking = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-BOOKING/rc-booking-model");
const Time = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-TIME/rc-time-model");




// Getting the Rating for Stage 0
const updateStage0Rating = async (bookingId,time,date) => {
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return false
        }
        const bookingDate = new Date(booking.date);
        const requestDate = new Date(date);
        if (bookingDate.toDateString() !== requestDate.toDateString()) {
            booking.completion_steps.stage_0.rating = 1;

        } else {
            const bookingTime = booking.time_start;
            const requestTime = time;
            const minutesDiff = (requestTime - bookingTime) * 60;
            if (minutesDiff >= 15) {
                booking.completion_steps.stage_0.rating = 1;
            } else if (minutesDiff >= 10 && minutesDiff < 15) {
                booking.completion_steps.stage_0.rating = 4;
            } else if (minutesDiff >= 0 && minutesDiff < 10) {
                booking.completion_steps.stage_0.rating = 3;
            } else if (minutesDiff >= -5 && minutesDiff < 0) {
                booking.completion_steps.stage_0.rating = 4;
            } else if (minutesDiff >= -30 && minutesDiff < -5) {
                booking.completion_steps.stage_0.rating = 5;
            }
            else {
                booking.completion_steps.stage_0.rating = 5;
            }
        }
        booking.completion_steps.stage_0.status_customer = true;
        booking.save();
        return true
    } catch (error) {
        return false
    }
};



// Getting the Rating for Stage 1
const updateStage1Rating = async (bookingId,time,date) => {
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return false;
        }
        const bookingDate = new Date(booking.date);
        const requestDate = new Date(date);
        if (bookingDate.toDateString() !== requestDate.toDateString()) {
            booking.completion_steps.stage_1.rating = 1;
        } else {
            const bookingTime = booking.time_start;
            const requestTime = time;
            const hoursDiff = requestTime - bookingTime;
            if (hoursDiff >= 24) {
                booking.completion_steps.stage_1.rating = 1;
            } else if (hoursDiff >= 6 && hoursDiff < 24) {
                booking.completion_steps.stage_1.rating = 2;
            } else if (hoursDiff >= 3 && hoursDiff < 6) {
                booking.completion_steps.stage_1.rating = 3;
            } else if (hoursDiff >= 1 && hoursDiff < 3) {
                booking.completion_steps.stage_1.rating = 4;
            } else {
                booking.completion_steps.stage_1.rating = 5;
            }
        }
        booking.completion_steps.stage_1.status_customer = true;
        booking.save();
       return true
    } catch (error) {
        console.log(error);
        return false
    }
};



// Getting the Rating for Stage 2
const updateStage2Rating = async (bookingId , time , date) => {
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return false
        }
        const bookingDate = new Date(booking.date);
        const requestDate = new Date(date);
        if (bookingDate.toDateString() !== requestDate.toDateString()) {
            booking.completion_steps.stage_2.rating = 1;
        } else {
            const bookingTimeStart = booking.time_start;
            const bookingTimeEnd = booking.time_end;
            const requestTime = time;
            const hoursDiff = requestTime - bookingTimeStart;
            const serviceId = booking.service;
            const numberOfInstalls = booking.number_of_installs;
            const timeData = await Time.findOne({ service: serviceId, number_of_installs: numberOfInstalls });
            const timeMin = timeData.time_min;
            const timeMax = timeData.time_max;
            if (hoursDiff <= timeMin) {
                booking.completion_steps.stage_2.rating = 5;
            } else if (hoursDiff < (timeMin + timeMax) / 2) {
                booking.completion_steps.stage_2.rating = 4;
            } else if (hoursDiff < timeMax) {
                booking.completion_steps.stage_2.rating = 3;
            } else if (hoursDiff < timeMax + 2) {
                booking.completion_steps.stage_2.rating = 2;
            } else {
                booking.completion_steps.stage_2.rating = 1;
            }
        }
        booking.completion_steps.stage_0.status_customer = true;
        booking.save();
      return true
    } catch (error) {
        console.log(error);
      return false
    }
};



// Calculating the Installer Rating

const calculateInstallerRating = async (bookingId) => {
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return false;
        }
        const { stage_0, stage_1, stage_2 } = booking.completion_steps;
        if (!stage_0.status_customer || !stage_1.status_customer || !stage_2.status_customer) {
            return false;
        }
        const totalRating = stage_0.rating + stage_1.rating + stage_2.rating;
        const installerRating = Math.round(totalRating / 3);
        booking.completion_steps.overall_completion.status_customer = true;
        booking.completion_steps.overall_completion.rating = installerRating;
        booking.completion_steps.stage_0.status_customer = true;
        await booking.save();
        return true
    } catch (error) {
        console.error(error);
      return true
    }
};




module.exports = {
    updateStage0Rating,
    updateStage1Rating,
    updateStage2Rating,
    calculateInstallerRating
}


