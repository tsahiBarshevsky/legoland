require('dotenv').config({ path: 'backend/.env' })
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const { Stripe } = require('stripe');
const stripe = Stripe(process.env.SECRET_KEY, { apiVersion: "2020-08-27" });
const orderid = require('order-id')('key');

const port = process.env.PORT || 5000;
var router = express.Router();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

// Models
const Product = require('./Models/Product');
const Order = require('./Models/Order');
const Cart = require('./Models/Cart');
const User = require('./Models/User');
const WishList = require('./Models/WishList');

// Connect to database
mongoose.connect('mongodb://localhost:27017/legoland', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
});

/* ======= Products ======= */

// Get all products
app.get('/get-all-products', async (req, res) => {
    Product.find({},
        function (err, result) {
            if (err) {
                console.log("Error: " + err)
                res.send(err);
            }
            else {
                console.log(`${result.length} products found`);
                res.json(result);
            }
        }
    );
});

// Search product by term
app.get('/search-product-by-term', async (req, res) => {
    const term = req.query.term;
    Product.find({
        $or: [
            { "name": { $regex: new RegExp(term, "i") } },
            { "brand": { $regex: new RegExp(term, "i") } }
        ]
    },
        function (err, result) {
            if (err) {
                console.log("Error: " + err)
                res.send(err);
            }
            else {
                console.log(`${result.length} products found`);
                res.json(result);
            }
        }
    );
});

function getFilterQuery(type, brands, ages, prices) {
    switch (type) {
        case ('brands-ages-prices'):
            return ({
                $and: [
                    { "brand": { $in: brands } },
                    { "ages": { $gte: ages[0], $lte: ages[1] } },
                    { "price": { $gte: prices[0], $lte: prices[1] } }
                ]
            });
        case ('brands-ages'):
            return ({
                $and: [
                    { "brand": { $in: brands } },
                    { "ages": { $gte: ages[0], $lte: ages[1] } },
                ]
            });
        case ('brands-prices'):
            return ({
                $and: [
                    { "brand": { $in: brands } },
                    { "price": { $gte: prices[0], $lte: prices[1] } }
                ]
            });
        case ('brands'):
            return ({ "brand": { $in: brands } });
        case ('ages-prices'):
            return ({
                $and: [
                    { "ages": { $gte: ages[0], $lte: ages[1] } },
                    { "price": { $gte: prices[0], $lte: prices[1] } }
                ]
            });
        case ('ages'):
            return ({ "ages": { $gte: ages[0], $lte: ages[1] } });
        case ('prices'):
            return ({ "price": { $gte: prices[0], $lte: prices[1] } });
    }
}

// Filter products
app.post('/filter-products', async (req, res) => {
    const type = req.query.type;
    const brands = req.body.brands;
    const ages = req.body.ages;
    const prices = req.body.prices;
    const query = getFilterQuery(type, brands, ages, prices);
    Product.find(query,
        function (err, result) {
            if (err) {
                console.log("Error: " + err)
                res.send(err);
            }
            else {
                console.log(`${result.length} products found`);
                res.json(result);
            }
        }
    );
});

// Update product stock
app.post('/update-product-stock', async (req, res) => {
    const catalogNumber = req.body.catalogNumber;
    const currentStock = req.body.currentStock;
    const amount = req.body.amount;
    Product.findOneAndUpdate(
        { catalogNumber: catalogNumber },
        { stock: currentStock - amount },
        function (err) {
            if (err) {
                console.log("Error: " + err)
                res.send(err);
            }
            else {
                res.json('Stock updated successfully');
            }
        }
    );
});

/* ======= Orders ======= */

// Get user's orders
app.get('/get-user-orders', async (req, res) => {
    var email = req.query.email;
    Order.find({ "owner": email },
        function (err, result) {
            if (err) {
                console.log("Error: " + err)
                res.send(err);
            }
            else {
                console.log(`${result.length} orders found`);
                res.json(result);
            }
        }
    );
});

// Add new order
app.post('/add-new-order', async (req, res) => {
    const orderNumber = orderid.generate();
    const newOrder = new Order({
        orderNumber: orderNumber,
        date: req.body.date,
        owner: req.body.owner,
        products: req.body.products,
        sum: req.body.sum,
        address: req.body.address,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        paymentConfirmation: req.body.paymentConfirmation
    });
    await newOrder.save();
    console.log('Order added successfully');
    res.json({
        orderId: newOrder._id,
        orderNumber: orderNumber,
        message: 'Order added successfully'
    });
});

/* ======= Users ======= */

// Add new user and create empty cart
app.post('/add-new-user', async (req, res) => {
    const newUser = new User({
        uid: req.body.uid,
        email: req.body.email,
        phone: req.body.phone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        addresses: {
            primary: {},
            secondary: {}
        }
    });
    const cart = new Cart({
        products: [],
        sum: 0,
        owner: req.body.uid
    });
    const wishList = new WishList({
        products: [],
        owner: req.body.uid
    });
    await newUser.save();
    await cart.save();
    await wishList.save();
    console.log('User added successfully');
    res.json({
        userID: newUser._id,
        cartID: cart._id,
        wishListID: wishList._id
    });
});

// Update user's address
app.post('/update-addresses', async (req, res) => {
    const id = req.query.id;
    const type = req.query.type;
    const address = req.body.address;
    if (type === 'primary')
        User.findByIdAndUpdate(id,
            { $set: { "addresses.primary": address } },
            function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                else
                    res.json("Primary address updeted successfully");
            }
        );
    else
        User.findByIdAndUpdate(id,
            { $set: { "addresses.secondary": address } },
            function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                else
                    res.json("Secondary address updeted successfully");
            }
        );
});

// Update personal details
app.post('/update-personal-details', async (req, res) => {
    const id = req.query.id;
    const personalDetails = req.body.personalDetails;
    User.findByIdAndUpdate(id,
        {
            $set: {
                firstName: personalDetails.firstName,
                lastName: personalDetails.lastName,
                phone: personalDetails.phone
            }
        },
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else
                res.json("Personal details updeted successfully");
        }
    );
});

// Get user information
app.get('/get-user-info', async (req, res) => {
    const uid = req.query.uid;
    User.findOne({ "uid": uid },
        function (err, result) {
            if (err) {
                console.log("Error: " + err)
                res.send(err);
            }
            else
                res.json(result);
        }
    );
});

/* ======= Carts ======= */

// Add new product to cart
app.post('/add-new-product-to-cart', async (req, res) => {
    var id = req.query.id;
    var product = req.body.product;
    var currentSum = req.body.currentSum;
    var amount = req.body.amount;
    const newProduct = {
        catalogNumber: product.catalogNumber,
        name: product.name,
        amount: amount,
        sum: product.sum
    };
    const newSum = currentSum + newProduct.sum;
    Cart.findByIdAndUpdate(id,
        { $push: { products: newProduct }, sum: newSum },
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else
                res.json("Product added successfully");
        }
    );
});

// Update product in cart
app.post('/update-product-in-cart', async (req, res) => {
    var id = req.query.id;
    var type = req.query.type;
    var product = req.body.product;
    var newAmount = req.body.newAmount;
    var currentSum = req.body.currentSum;
    Cart.findOneAndUpdate({ id, products: { $elemMatch: { catalogNumber: product.catalogNumber } } },
        {
            $set: {
                "products.$.amount": type === 'increment' ? newAmount + req.body.amount : req.body.amount - newAmount,
                "products.$.sum": type === 'increment' ? (newAmount + req.body.amount) * product.price : (req.body.amount - newAmount) * product.price
            },
            sum: type === 'increment' ? currentSum + (newAmount * product.price) : currentSum - (newAmount * product.price)
        },
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else
                res.json("Product updeted successfully");
        }
    );
});

// Remove product from cart
app.post('/remove-product-from-cart', async (req, res) => {
    var id = req.query.id;
    var product = req.body.product;
    var sum = req.body.sum;
    Cart.findByIdAndUpdate(id,
        { $pull: { "products": { catalogNumber: product.catalogNumber } }, sum: sum },
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else
                res.json("Product deleted successfully");
        }
    );
});

// Empty cart
app.post('/empty-cart', async (req, res) => {
    var id = req.query.id;
    console.log('id', id)
    Cart.findByIdAndUpdate(id,
        { $set: { "products": [] }, sum: 0 },
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else
                res.json("Cart empty successfully");
        }
    );
});

// Get user cart
app.get('/get-user-cart', async (req, res) => {
    var uid = req.query.uid;
    Cart.findOne({ "owner": uid },
        function (err, result) {
            if (err) {
                console.log("Error: " + err)
                res.send(err);
            }
            else
                res.json(result);
        }
    );
});

app.post('/create-payment-intent', async (req, res) => {
    const amount = req.query.amount;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ["card"]
        });
        const clientSecret = paymentIntent.client_secret;
        res.json({ clientSecret: clientSecret });
    }
    catch (e) {
        console.log(e.message);
        res.json({ error: e.message });
    }
});

/* ======= Wish Lists ======= */

// Get user wish list
app.get('/get-user-wish-list', async (req, res) => {
    var uid = req.query.uid;
    WishList.findOne({ "owner": uid },
        function (err, result) {
            if (err) {
                console.log("Error: " + err)
                res.send(err);
            }
            else
                res.json(result);
        }
    );
});

// Add new product to wish list
app.post('/add-new-product-to-wish-list', async (req, res) => {
    var id = req.query.id;
    var product = req.body.product;
    WishList.findByIdAndUpdate(id,
        { $push: { products: product } },
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else
                res.json("Product added successfully to wishlist");
        }
    );
});

// Remove product from wish list
app.post('/remove-product-from-wish-list', async (req, res) => {
    var id = req.query.id;
    var product = req.body.product;
    WishList.findByIdAndUpdate(id,
        { $pull: { "products": { catalogNumber: product.catalogNumber } } },
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else
                res.json("Product deleted successfully from wishlist");
        }
    );
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = router;