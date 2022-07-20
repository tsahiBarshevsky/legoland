const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;
var router = express.Router();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

// Models
const Product = require('./Models/Product');
const Order = require('./Models/Order');
const Cart = require('./Models/Cart');
const User = require('./Models/Users');

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
    const newOrder = new Order({
        orderNumber: req.body.orderNumber,
        date: req.body.date,
        owner: req.body.owner,
        products: req.body.products,
        sum: req.body.sum,
        address: req.body.address,
        payment: req.body.payment
    });
    await newOrder.save();
    console.log('Order added successfully');
    res.json({
        order_id: newOrder._id,
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
        address: ''
    });
    const cart = new Cart({
        products: [],
        sum: 0,
        owner: req.body.uid
    });
    await newUser.save();
    await cart.save();
    console.log('User added successfully');
    res.json('User added successfully');
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

app.get('/check', async (req, res) => {
    res.json("check ok");
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = router;