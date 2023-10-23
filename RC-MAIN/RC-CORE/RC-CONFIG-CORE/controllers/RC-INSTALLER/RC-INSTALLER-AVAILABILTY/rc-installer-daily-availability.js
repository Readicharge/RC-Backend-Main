const Availability = require('../../../models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-daily-model');
const Service = require("../../../models/RC-SERVICE/rc-service-model")
const Installer = require("../../../models/RC-INSTALLER/rc-installer-model")


const { getTimeForService } = require('../../../utils/timeForService');

exports.updateAvailability = async (data, installerId) => {
  try {
    const { date, time_start, time_end, type } = data;
    const availability = await Availability.findOne({ installer_id: installerId, date: date });

    if (availability) {
      if (availability.time_start === time_start && availability.time_end === time_end) {
        // Delete the availability if the time slots match
        // await Availability.findByIdAndDelete(availability._id);
        if (availability.type !== type) {
          availability.type = type;
          await availability.save();
          return {
            status: 200,
            data: availability
          }
        }
        else {
          return {
            status: 200,
            data: availability
          }
        }
      } else {
        // Update the availability if the time slots are different
        availability.time_start = time_start;
        availability.time_end = time_end;
        availability.type = type;
        await availability.save();
        return {
          status: 200,
          data: availability
        }
      }
    } else {
      const installer = await Installer.findById(installerId);
      if (!installer) {
        // return res.status(404).json({ message: 'No such installer found' });
        return {
          status:404,
          data: "No such Installer Found"
        }
      }

      const serviceIds = installer.services;
      const services = await Service.find({ _id: { $in: serviceIds } });
      if (!services || services.length === 0) {
        // return res.status(404).json({ message: 'No services found for this installer' });
        return {
          status : 404,
          data : "No such service is selected by the installer"
        }
      }

      let leastTimeService = null;
      let leastTimeDiff = Infinity;
      for (let i = 0; i < services.length; i++) {
        const service = services[i];
        const times = await getTimeForService(service._id);
        if (times === null) {
          continue;
        }
        const serviceTimeDiff = times;
        if (serviceTimeDiff < leastTimeDiff) {
          leastTimeDiff = serviceTimeDiff;
          leastTimeService = service;
        }
      }

      if (!leastTimeService) {
        // return res.status(404).json({ message: 'Could not find service with least time' });
        return {
          status : 404 , 
          data : "Could not find the service with the least time"
        }
      }

      const bookingDuration = time_end - time_start;
      if (bookingDuration < leastTimeDiff) {
        // return res.status(400).json({ message: `Booking duration is less than required service duration (${leastTimeDiff} minutes)` });
        return {
          status : 400,
          data : `Booking duration is less than required service duration (${leastTimeDiff} minutes)`
        }
      }

      const newAvailability = new Availability({
        installer_id: installerId,
        date: date,
        time_start: time_start,
        time_end: time_end,
        type: type
      });

      await newAvailability.save();
      // return res.json(newAvailability);
      return {
        status : 200,
        data : newAvailability
      }
    }
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ message: 'Internal server error' });
    return {
      status : 500,
      data : "Not able to update the availability"
    }
  }
};

exports.getAvailabilityByInstallerId = async (installerId) => {
  try {
    // const installerId = req.params.installerId;
    const availabilities = await Availability.find({ installer_id: installerId });
    // return res.json(availabilities);
    return {
      status:200,
      data : availabilities
    }
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ message: 'Internal server error' });
    return {
      status:500,
      data:"Not able to get the availability for the Installer"
    }
  }
};
