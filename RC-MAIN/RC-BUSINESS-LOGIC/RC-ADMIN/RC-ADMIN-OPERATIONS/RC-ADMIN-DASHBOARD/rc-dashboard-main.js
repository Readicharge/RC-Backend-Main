const Installer = require("../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/rc-installer-model");
const Installer_Parked = require("../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-PARKED/rc-installer-parked-model");
const Service = require("../../../../RC-CORE/RC-CONFIG-CORE/models/RC-SERVICE/rc-service-model");
const Booking = require("../../../../RC-CORE/RC-CONFIG-CORE/models/RC-BOOKING/rc-booking-model");

const getInstaller_headerCard_data = async (req, res) => {
    try {
        // This will return 
        // 1. Total Number of Installers ( all over )
        const overallInstallers = await Installer.find({});
        const overallInstallersCount = overallInstallers.length;
        // 2. Total Number of Installers ( active )
        const overallActiveInstallers = await Installer.find({
            'clearCheck_status.verified': true
        });
        const overallActiveInstallersCount = overallActiveInstallers.length;
        // 3. Total Number of Installers Available on that day 
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the current day's start

        const installersForToday = await Installer_Parked.find({
            date: today,
            $or: [{ installer_parked: true }, { installer_booked: true }]
        })
        // 4. Total Number of Installers Scheduled on that day
        const bookedInstaller = 10;

        console.log(overallInstallersCount, overallActiveInstallersCount, bookedInstaller, installersForToday)

        res.status(200).json({
            overallInstallersCount,
            overallActiveInstallersCount,
            bookedInstaller,
            installersForToday: overallInstallersCount - installersForToday.length
        })



    }
    catch (err) {
        // This will return the null value to render 
        res.status(500).json({
            overallInstallersCount: 0,
            overallActiveInstallersCount: 0,
            bookedInstaller: 0,
            installersForToday: 0
        })
    }
}



const getJobData_Dashboard = async (req, res) => {
    try {
        // Here we want the data based on the service and segregation 

        const services = await Service.find({});
        const data ={
            day: {
                BI: { serviceName:"Basic Install" , totalJobs: 0, totalPaidJobs: 0 },
                II: { serviceName:"Immidiate Install" , totalJobs: 0, totalPaidJobs: 0 },
                AI: { serviceName:"Advance Install" , totalJobs: 0, totalPaidJobs: 0 },
                AI80: { serviceName:"Advance 80 Install" , totalJobs: 0, totalPaidJobs: 0 },
            },
            week:{
                BI: { serviceName:"Basic Install" , totalJobs: 0, totalPaidJobs: 0 },
                II: { serviceName:"Immidiate Install" , totalJobs: 0, totalPaidJobs: 0 },
                AI: {  serviceName:"Advance Install" , totalJobs: 0, totalPaidJobs: 0 },
                AI80: { serviceName:"Advance 80 Install" , totalJobs: 0, totalPaidJobs: 0 },
            },
            month: {
                BI: { serviceName:"Basic Install" , totalJobs: 0, totalPaidJobs: 0 },
                II: { serviceName:"Immidiate Install" , totalJobs: 0, totalPaidJobs: 0 },
                AI: {  serviceName:"Advance Install" , totalJobs: 0, totalPaidJobs: 0 },
                AI80: { serviceName:"Advance 80 Install" , totalJobs: 0, totalPaidJobs: 0 },
            },
            year: {
                BI: { serviceName:"Basic Install" , totalJobs: 0, totalPaidJobs: 0 },
                II: { serviceName:"Immidiate Install" , totalJobs: 0, totalPaidJobs: 0 },
                AI: {  serviceName:"Advance Install" , totalJobs: 0, totalPaidJobs: 0 },
                AI80: { serviceName:"Advance 80 Install" , totalJobs: 0, totalPaidJobs: 0 },
            },
        };

   


        for (let i = 0; i < services.length; i++) {
            const service_id = services[i]._id;
            const service_code = services[i].service_code;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Function to get jobs for a specific time period and service
            const getJobsForPeriod = async (startDate, endDate) => {
                const allJobs = await Booking.find({ date: { $gte: startDate, $lte: endDate }, primaryService: service_id });
                const paidJobs = await Booking.find({ date: { $gte: startDate, $lte: endDate }, primaryService: service_id, 'customer_paid.status': true });

                return {serviceName:service_code==="BI" ? "Basic Install":
                                    service_code==="II" ? "Immidiate Install":
                                    service_code==="AI" ? "Advance Install" : 
                                     "Advance 80 Instal", totalJobs: allJobs.length, totalPaidJobs: paidJobs.length };
            };

            // Day
            const dayStartDate = new Date(today);
            const dayEndDate = new Date(today);
            const dayJobs = await getJobsForPeriod(dayStartDate, dayEndDate);
            data.day[service_code] = dayJobs;
       

            // Week
            const weekStartDate = new Date(today);
            weekStartDate.setDate(today.getDate() - today.getDay());
            const weekEndDate = new Date(today);
            weekEndDate.setDate(weekStartDate.getDate() + 6);
            const weekJobs = await getJobsForPeriod(weekStartDate, weekEndDate);
            data.week[service_code] = weekJobs;

            console.log("2st")
            // Month
            const monthStartDate = new Date(today);
            monthStartDate.setMonth(today.getMonth(), 1);
            const monthEndDate = new Date(today);
            monthEndDate.setMonth(monthStartDate.getMonth() + 1, 0);
            const monthJobs = await getJobsForPeriod(monthStartDate, monthEndDate);
            data.month[service_code] = monthJobs;

            console.log("3st")

            // Year
            const yearStartDate = new Date(today);
            yearStartDate.setMonth(0, 1);
            const yearEndDate = new Date(today);
            yearEndDate.setMonth(11, 31);
            const yearJobs = await getJobsForPeriod(yearStartDate, yearEndDate);
            data.year[service_code] = yearJobs;
            console.log("4st")
        }

        console.log('Final Data:', data);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    getInstaller_headerCard_data,
    getJobData_Dashboard
}