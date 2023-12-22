// This section will find the list of days in the calender month on which any installer is available or not
const Schedule = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-availability-model");
const Availability = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-daily-model");
const Installer_Parked = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-PARKED/rc-installer-parked-model");

// Importing the Booking Model 
const Time = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-TIME/rc-time-model");

// Declaring the Helper functions
const getInactiveDatesForInstaller = async (installerId, serviceId, number_of_installs) => {

  // console.log(installerId,"Installer")
  try {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(`${year + 1}-${month}-01`);

    console.log(startDate, endDate);

    const timeSlot = await Time.findOne({
      service_id: serviceId,
      number_of_installs: number_of_installs
    });

    console.log(timeSlot,number_of_installs,)



    const schedules = await Schedule.find({ installer_id: installerId });
    // console.log(schedules.length)
    var inactiveDates = [];
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {


      console.log(date)
      var day = date.toLocaleString('default', { weekday: 'long' });
      var schedule = schedules.find(s => s.day === day);



      const scheduleStartTime = schedule.startTime;
      const scheduleEndTime = schedule.endTime;

      console.log(typeof(schedule.active))

      if (schedule.active) {
        console.log(timeSlot)
        const timeMax = timeSlot.time_max;
        console.log("hello", timeMax, scheduleStartTime)

        if ((scheduleEndTime - scheduleStartTime) < timeMax) {
          inactiveDates.push(date.toISOString().substring(0, 10));
        }
       
      }
      else {

        inactiveDates.push(date.toISOString().substring(0, 10));
       

      }

      // console.log(inactiveDates)
    }

    return inactiveDates;
  } catch (err) {
    return []
  }
};


const getDailyModifiedDates = async (installerId) => {
  try {
    console.log(installerId, "Installer")

    // Checking for any particular day booking availability present or not
    const availabilities = await Availability.find({
      installer_id: installerId,
      type: "DISABLED"
    });
    // console.log(availabilities)

    var inactiveDates = [];
    availabilities.forEach(dailyDates => {
      // console.log(dailyDates)
      inactiveDates.push(dailyDates.date.toISOString().substring(0, 10));
    });

    // Checking for any parked Installer on that day frm the list 
    const parkedInstaller = await Installer_Parked.find({
      installer_id: installerId,
      $or: [
        { installer_parked: true },
        { installer_booked: true },
      ],
    });


    parkedInstaller.forEach(parked => {
      // console.log(parked)
      inactiveDates.push(parked.date.toISOString().substring(0, 10));
    });



    return inactiveDates;
  } catch (error) {
    console.error(error);
    return [];
  }
};






function extractUniqueDatesFromArray(datesArray) {
  const dateCounts = new Map();

  // Count the occurrence of each date in each subarray
  datesArray.forEach(dateArray => {
    const uniqueDatesInArray = new Set();
    dateArray.forEach(date => {
      if (date) {
        uniqueDatesInArray.add(date);
      }
    });

    // Increment the count for each unique date
    uniqueDatesInArray.forEach(date => {
      if (dateCounts.has(date)) {
        dateCounts.set(date, dateCounts.get(date) + 1);
      } else {
        dateCounts.set(date, 1);
      }
    });
  });

  // Get dates that are present in at least one subarray
  const uniqueDates = Array.from(dateCounts.keys()).filter(date => dateCounts.get(date) > 0);

  return uniqueDates;
}


// *************************************************************************************************
//              FUNCTION FOR CHECKING THE AVAILABILTY FOR THAT DAY 
// *************************************************************************************************


const days_fully_blocked = async (installers, serviceId, number_of_installs) => {

  // Getting the required Inputs 
  var dataWeekly = [];
  var dataDaily = [];

  // console.log(installers.length);

  for (const installer of installers) {
    const installerDetail = installer.installer;
    const installerId = installerDetail._id;

    const unavailableDatesWeekly = await getInactiveDatesForInstaller(installerId, serviceId, number_of_installs);
    const unavailableDatesDaily = await getDailyModifiedDates(installerId);



    console.log(unavailableDatesWeekly.length, unavailableDatesDaily.length);
    dataWeekly.push(unavailableDatesWeekly);
    dataDaily.push(unavailableDatesDaily);
  }


  const weekly_non_available_dates = extractUniqueDatesFromArray(dataWeekly);
  const daily_non_available_dates = extractUniqueDatesFromArray(dataDaily);


  const data_output = {
    weekly_non_available_dates: weekly_non_available_dates,
    daily_non_available_dates: daily_non_available_dates
  }

  // console.log(data_output);

  return data_output;


}



module.exports = {
  days_fully_blocked
}