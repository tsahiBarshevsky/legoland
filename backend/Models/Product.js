const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    catalogNumber: { type: String },
    name: { type: String },
    price: { type: Number },
    stock: { type: Number },
    description: { type: String },
    image: { type: String },
    brand: { type: String },
    ages: { type: Number },
    pieces: { type: Number }
});

const Product = mongoose.model("products", ProductSchema);

module.exports = Product;