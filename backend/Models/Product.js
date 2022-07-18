const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    catalogNumber: { type: String },
    name: { type: String },
    price: { type: Number },
    stock: { type: Number },
    description: { type: String },
    image: { type: String },
    category: { type: String },
    age: { type: Number }
});

const Product = mongoose.model("products", ProductSchema);

module.exports = Product;