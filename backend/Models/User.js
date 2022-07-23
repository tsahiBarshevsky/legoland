const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: { type: String },
    email: { type: String },
    phone: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    addresses: { type: Map }
});

const User = mongoose.model("users", UserSchema);

module.exports = User;