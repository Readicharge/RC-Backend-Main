
const mongoose = require('mongoose');
const materialsSchema = new mongoose.Schema({
    material_name: {
        type: String,
        required: true
    },
    service_code: {
        type: String,
        enum: ["BI", "II", "AI", "AI80"]
    },
    material_code: {
        type: String,
        enum: [
            "Misc_Material",
            "Breaker",
            "Wire_4_4_25",
            "Wire_4_4_50",
            "Wire_4_4_75",
            "Wire_4_4_100",
            "Wire_3_4_25",
            "Wire_3_4_50",
            "Wire_3_4_75",
            "Wire_3_4_100",
            "Panel_Load_Center_60A",
            "Panel_Load_Central_80_100_A",
            "NMEA_14_15_outlet"
        ]

    },
    material_desc: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    number_of_chargers: {
        type: Number,
        required: true
    }
})

const Materials = mongoose.model('Materials', materialsSchema);
module.exports = Materials;