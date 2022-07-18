const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String },
    date: { type: Date },
    owner: { type: String },
    products: { type: Array },
    sum: { type: Number },
    address: { type: String },
    payment: { type: String }
});

const Order = mongoose.model("orders", OrderSchema);

module.exports = Order;