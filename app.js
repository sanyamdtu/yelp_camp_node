var express = require("express"),
    server = express(),
    mongoose = require('mongoose'),
    passport = require("passport"),
    passport_local = require("passport-local"),
    user = require("./models/user"),
    camp_route = require("./routes/camps"),
    comments_route = require("./routes/comments"),
    index_routes = require("./routes/index"),
    method_override = require("method-override"),
    flash = require("connect-flash")

mongoose.connect("mongodb://sanyam:sanyam2001@yelpcamp-shard-00-00-weo0n.mongodb.net:27017,yelpcamp-shard-00-01-weo0n.mongodb.net:27017,yelpcamp-shard-00-02-weo0n.mongodb.net:27017/test?ssl=true&replicaSet=Yelpcamp-shard-0&authSource=admin&retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })

server.set('views', __dirname + '/views')
server.set('view engine', "ejs")
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(express.static(__dirname + "/public"))
server.use(method_override("_method"))
mongoose.set('useFindAndModify', false);
server.use(flash())
    ///======================
    //passport middlewares
server.use(require("express-session")({
    secret: 'The world Must Understand Pain',
    resave: false,
    saveUninitialized: false,
}))
server.use(passport.initialize())
server.use(passport.session())
passport.use(new passport_local(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

server.use((req, res, next) => {
    res.locals.current_user = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
        ////the middle wares for signed in and logout
})

server.use("/", index_routes)
server.use("/camp", camp_route)
server.use("/camp/:id/comments", comments_route)

server.listen(process.env.port || 8080, () => {
    console.log("server has started")
})