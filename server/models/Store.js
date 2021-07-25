const mongoose = require('mongoose');
const moment = require("moment");

moment.normalizeUnits.setDefault('Asia/Seoul');
let date = moment().format('YYYY-MM-DD HH:mm:ss');

const storeSchema = mongoose.Schema({
    
    id :{
        type: String
    },
    name: {
        type: String,
        maxlength:50,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 0,
        required: true
    },
    menu: [{
        name : { type : String },
        price : { type : Number, required: true },
        images : { type : String },
        sold: { type: Number, default: 0 }
    }],
    review: [{
        writer: { type: String },
        createdAt: date,
        comment: { type: String } 
    }],
    location: [{
        latitue: Number,
        longitude: Number
    }]
}, { timestamps: true})

const Store = mongoose.model('Store', storeScheam);

module.exports = { Store }