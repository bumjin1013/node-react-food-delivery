const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const paymentSchema = mongoose.Schema({
    useR: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    }
}, { timestamps: true})


const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment }