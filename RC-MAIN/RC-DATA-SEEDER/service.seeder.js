const Service = require('../RC-CORE/RC-CONFIG-CORE/models/RC-SERVICE/rc-service-model'); 
const CustomerRates = require("../RC-CORE/RC-CONFIG-CORE/models/RC-CUSTOMER-RATE/rc-customer_rate-model");
const Material = require("../RC-CORE/RC-CONFIG-CORE/models/RC-MATERIAL/rc-material-model");
const Time = require("../RC-CORE/RC-CONFIG-CORE/models/RC-TIME/rc-time-model");


// Data taken from the master data folder for the real transactional use 
const servicesToSeed = require("./RC-MASTER-DATA/service_data");

// Function to seed data
async function seedServices() {
  try {
   
    console.log(servicesToSeed.servicesToSeed)
    for (const serviceData of servicesToSeed.servicesToSeed) {
      const service = new Service(serviceData);
      await service.save();
      console.log(`Service "${service.name}" has been seeded.`);
    }

   
    console.log('Data seeding completed.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}


// function to seed the customer cost for the services
async function seedServiceCosts() {
    try {
        for(const servcieCostData of serviceCostToSeed) {
            const serviceCost   = new CustomerRates(servcieCostData);
            await serviceCost.save()
        }
   
        console.log('Data seeding for Service Cost / Customer Rates completed.');
    } catch (error) {
      console.error('Error seeding data:', error);
    }
}


// function to seed the material
async function seedMaterial() {
    try {
        for(const materialData of materialsToSeed) {
            const material   = new Material(materialData);
            await material.save()
        }
   
        console.log('Data seeding for material completed.');
    } catch (error) {
      console.error('Error seeding data:', error);
    }
}

// fucntion to seed the time per service 
async function seedTime() {
    try {
        for(const timeData of timeDataToFeed) {
            const time   = new Time(timeData);
            await time.save()
        }
   
        console.log('Data seeding for Time Per Service completed.');
    } catch (error) {
      console.error('Error seeding data:', error);
    }
}






const data_seeder_main = async (req,res) => {

    // First starting with seeding the services so that we can get their data here
    await seedServices();
    // Once the seeding is completed , then parse the entore seeded data to get their Id 
    const services_created_here = await Service.find({});
    // Parsing through all the serices created 
    for(const service_data of services_created_here) {
        console.log(service_data._id);
    }
    res.json({data:"Operation Completed Successfully"});

    // 
}


module.exports = {
    data_seeder_main
}

