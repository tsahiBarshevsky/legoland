const mongoose = require('mongoose');

const WishListSchema = new mongoose.Schema({
    products: { type: Array },
    owner: { type: String }
});

const WishList = mongoose.model("wish-lists", WishListSchema);

module.exports = WishList;