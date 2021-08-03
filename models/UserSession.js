const mongoose = require("mongoose");

const UserSessionSchema = new mongoose.Schema({
    user: { type : mongoose.Schema.Types.ObjectId , ref: 'User'},
    token:{ type : String, required: true }
});

module.exports = mongoose.model("UserSession", UserSessionSchema);


