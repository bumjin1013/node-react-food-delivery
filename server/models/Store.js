const mongoose = require('mongoose');
const moment = require("moment");
const { Mixed } = require('mongoose');
const Schema = mongoose.Schema;



const storeSchema = mongoose.Schema({
    
    id: {
        type: Schema.Types.ObjectId
    },
    description: {
        type: String
    },
    title: {
        type: String,
        maxlength:50,
        required: true
    },
    image: {
        type: Array
    },
    category: {
        type: String,
        default: 0,
        required: true
    },
    menu: [{
        name : { type : String },
        price : { type : Number, required: true },
        image : { type : [] },
        sold: { type: Number, default: 0 }
    }],
    review: [{
        writer: { type: String },
        contents: { type: String },
        star: { type: Number },
        image: { type: [] },
        comments: { type: String }
    }],
    location: {
        address: String,
        latitue: Number,
        longitude: Number
    },
    order: {
        type: Array,
        default: []
    }
}, { timestamps: true})

const Store = mongoose.model('Store', storeSchema);

module.exports = { Store }