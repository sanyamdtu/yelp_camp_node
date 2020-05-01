var mongoose = require('../node_modules/mongoose')
var comment_schema = new mongoose.Schema({
    title: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }
})
var comments_db = mongoose.model("comments_db", comment_schema)
module.exports = comments_db;