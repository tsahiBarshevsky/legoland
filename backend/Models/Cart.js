const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    products: { type: Array },
    sum: { type: Number }
});

const Cart = mongoose.model("carts", CartSchema);

module.exports = Cart;