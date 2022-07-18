const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String }
});

const User = mongoose.model("users", UserSchema);

module.exports = User;