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

// Search product by name
app.get('/search-product-by-name', async (req, res) => {
    const name = req.query.name;
    Product.find({ "name": { $regex: new RegExp(name, "i") } },
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

app.post('/find-product-by-brand', async (req, res) => {
    const brands = req.body.brands;
    const ages = req.body.ages;
    const pieces = req.body.pieces;
    const prices = req.body.prices;
    Product.find({
        $and: [
            { "brand": { $in: brands } },
            { "ages": { $gte: ages[0], $lte: ages[1] } },
            // { "pieces": { $gte: pieces[0], $lte: pieces[1] } },
            { "price": { $gte: prices[0], $lte: prices[1] } },
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
        firstName: req.body.firsName,
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
        phone: '',
        firstName: '',
        lastName: '',
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
    await newUser.save();
    await cart.save();
    console.log('User added successfully');
    res.json(newUser._id);
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

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = router;