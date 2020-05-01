var register_login_routes = require("express").Router(),
    passport = require("passport"),
    user = require("../models/user")

register_login_routes.get('/', (req, res, next) => {
    res.render("landing")
})

register_login_routes.get("/register", (req, res) => {
    res.render("register.ejs")
})

register_login_routes.post("/register", (req, res) => {

    user.register(new user({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            return res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Hello " + req.user.username + " ,you are registered and logged in")
                res.redirect("/")
            })
        }
    })

})

///========================================================
//
//login routes
//
//============================================================
register_login_routes.get("/login", (req, res) => {
    res.render("login")
})
register_login_routes.post("/login", passport.authenticate("local", {
    successRedirect: "/camp",
    failureRedirect: "/login"
}))
register_login_routes.get("/logout", (req, res) => {
    req.logOut()
    req.flash("success", "Logged you out")
    res.redirect("/")
})

module.exports = register_login_routes