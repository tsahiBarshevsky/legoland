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

app.get('/check', async (req, res) => {
    res.json("check ok");
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = router;