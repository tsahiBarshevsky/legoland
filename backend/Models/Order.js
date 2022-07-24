const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String },
    date: { type: Date },
    owner: { type: String },
    products: { type: Array },
    sum: { type: Number },
    address: { type: Map },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    paymentConfirmation: { type: Object }
});

const Order = mongoose.model("orders", OrderSchema);

module.exports = Order;