const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    products: { type: Array },
    sum: { type: Number },
    owner: { type: String }
});

const Cart = mongoose.model("carts", CartSchema);

module.exports = Cart;