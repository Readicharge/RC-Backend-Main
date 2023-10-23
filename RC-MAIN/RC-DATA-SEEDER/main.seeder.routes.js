const express = require('express');
const router = express.Router();




const {data_seeder_main} = require("./service.seeder");

router.post("/service",data_seeder_main);




module.exports = router;