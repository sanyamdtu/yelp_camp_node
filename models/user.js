var mongoose = require("mongoose"),
    passport_local_mongoose = require("passport-local-mongoose")
var user_schema = new mongoose.Schema({
    username: String,
    password: String
})
user_schema.plugin(passport_local_mongoose)
module.exports = mongoose.model("user", user_schema)