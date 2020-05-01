var mongoose = require('../node_modules/mongoose')
var comments_db = require("./comment")
var camp_schema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments_db"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }
})
var camps_with_info_db = mongoose.model("camps_with_info_db", camp_schema)
module.exports = camps_with_info_db