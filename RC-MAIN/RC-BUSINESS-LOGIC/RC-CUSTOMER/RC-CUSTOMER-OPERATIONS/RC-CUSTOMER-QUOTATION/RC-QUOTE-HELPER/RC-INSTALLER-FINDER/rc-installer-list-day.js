// This section will find the list of days in the calender month on which any installer is available or not
const Schedule = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-availability-model");
const Availability = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-daily-model");

// Importing the Booking Model 
const Booking = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-BOOKING/rc-booking-model");
const { getInactiveDates } = require("../../../../../RC-INSTALLER/RC-INSTALLER-OPERATIONS/RC-INSTALLER-SCHEDULE-MAIN/rc-installer-weekly-schedule");

// Declaring the Helper functions
const getInactiveDatesForInstaller = async (installerId) => {

  // console.log(installerId,"Installer")
    try {
      const year = new Date().getFullYear();
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      
      const schedules = await Schedule.find({ installer_id:installerId, active: false  });
      // console.log(schedules.length)
      var inactiveDates = [];
      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        var day = date.toLocaleString('default', { weekday: 'long' });
        var schedule = schedules.find(s => s.day === day);
        var isDisabled = schedule ? true : false;
        if (isDisabled) {
          inactiveDates.push(date.toISOString().substring(0, 10));
        }
      }
      
      return inactiveDates;
    } catch (err) {
      return []
    }
  };


  const getDailyModifiedDates = async (installerId) => {
    try {
      const availabilities = await Availability.find({ installer_id: installerId , type : {$ne : "DISABLED"} , installer_parked: {$ne : true} });
      console.log(availabilities);
      return availabilities;
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

    // Get dates that are present in all subarrays
    const commonDates = Array.from(dateCounts.keys()).filter(date => dateCounts.get(date) === datesArray.length);



    return commonDates;
}


// *************************************************************************************************
//              FUNCTION FOR CHECKING THE AVAILABILTY FOR THAT DAY 
// *************************************************************************************************


const days_fully_blocked = async (installers) => {

    // Getting the required Inputs 
    var dataWeekly = [];
    var dataDaily = [];

    // console.log(installers.length);

    for(const installer of installers)
    {
        const installerDetail = installer.installer;
        const installerId = installerDetail._id;

        const unavailableDatesWeekly = await getInactiveDatesForInstaller(installerId);
        const unavailableDatesDaily = await getDailyModifiedDates(installerId);

        console.log(unavailableDatesWeekly.length,unavailableDatesDaily.length);
        dataWeekly.push(unavailableDatesWeekly);
        dataDaily.push(unavailableDatesDaily);
    }

    
    const weekly_non_available_dates =  extractUniqueDatesFromArray(dataWeekly);
    const daily_non_available_dates =  extractUniqueDatesFromArray(dataDaily);


    const data_output = {
        weekly_non_available_dates: weekly_non_available_dates,
        daily_non_available_dates: daily_non_available_dates
    }


    return data_output;


}



module.exports = {
    days_fully_blocked
}