const Time = require('../../models/RC-TIME/rc-time-model');
const Installer = require('../../models/RC-INSTALLER/rc-installer-model');



exports.createTime = async (data) => {
  try {
    const time = new Time(data);
    await time.save();
    // res.status(201).json(time);
    return {
      status: 200,
      data: "New Time Created"
    }
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: 'Server Error' });
    return {
      status: 500,
      data: "Could not create new Time"
    }
  }
};


exports.getAllTimes = async () => {
  try {
    const times = await Time.find();
    // res.status(200).json(times);
    return {
      status: 200,
      data: times
    }
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: 'Server Error' });
    return {
      status: 500,
      data: "Not able to get all times"
    }
  }
};




exports.getTimeperInstaller = async (installerId) => {
  try {


    const installer = await Installer.findById(installerId);
    if (!installer) {
      return res.status(404).json({ message: 'Installer not found' });
    }

    const serviceIds = installer.services; // Assuming installer.services is an array of service IDs

    if (serviceIds.length === 0) {
      return res.status(400).json({ message: 'Installer has no services' });
    }
    console.log(serviceIds);
    const timePerServices = await Time.find({ service_id: { $in: serviceIds }, number_of_installs: 1 });
    if (timePerServices.length === 0) {
      return res.status(404).json({ message: 'Time not found for any services' });
    }
    console.log(timePerServices);
    const minTimeService = timePerServices.reduce((minTimeService, currentService) => {
      return currentService.time_max < minTimeService.time_max ? currentService : minTimeService;
    }, timePerServices[0]);

    //  res.status(200).json({time:minTimeService.time_max});
    return {
      status: 200,
      data: minTimeService.time_max
    }

  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: 'Server Error' });
    return {
      status: 500,
      data: "Not able to get time per installer"
    }
  }
};




exports.getTimeById = async (id) => {
  try {
    // const { id } = req.params;
    const time = await Time.findById(id);
    if (!time) {
      // return res.status(404).json({ message: 'Time not found' });
      return {
        status: 404,
        data: "Time not found"
      }
    }
    // res.status(200).json(time);
    return {
      status:200,
      data:time
    }
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: 'Server Error' });
    return {
      status : 500,
      data: "Not able to get specific time"
    }
  }
};


exports.updateTime = async (id,data) => {
  try {
    // const { id } = req.params;
    const time = await Time.findByIdAndUpdate(id, data, { new: true });
    if (!time) {
      // return res.status(404).json({ message: 'Time not found' });
      return {
        status: 404,
        data: "Time not found"
      }
    }
    // res.status(200).json(time);
    return {
      status : 200,
      data: "Time Updated successfully"
    }

  } catch (error) {
    // console.error(error);
    // res.status(500).json({ message: 'Server Error' });
    return {
      status:500,
      data:"Error in Updating the Time"
    }
  }
};


exports.deleteTime = async (id) => {
  try {
    // const { id } = req.params;
    const time = await Time.findByIdAndDelete(id);
    if (!time) {
      // return res.status(404).json({ message: 'Time not found' });
      return {
        status : 404,
        data: "Time not found"
      }
    }
    // res.status(200).json({ message: 'Time deleted successfully' });
    return {
      status:200,
      data: "Time deleted successfully"
    }
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: 'Server Error' });
    return {
      status:500,
      data:"Error in deleting the Time"
    }
  }
};
