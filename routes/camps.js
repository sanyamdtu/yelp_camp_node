var camps_route = require("express").Router(),
    camps_with_info_db = require("../models/camps"),
    middlewares = require("../middlewares/index")
camps_route.get('/', (req, res, next) => {
    camps_with_info_db.find({}, (err, camps) => {
        if (err)
            console.log(err)
        else
            res.render("camps", { camps: camps })
    })
})
camps_route.post('/', middlewares.isloggedin, (req, res) => {
    camps_with_info_db.create({
        name: req.body.name,
        image: req.body.url,
        desc: req.body.desc,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, (err, camp) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect("/camp/new")
        } else
            res.redirect('/camp')
    })
})
camps_route.get('/new', middlewares.isloggedin, (req, res) => {
    res.render("new")
})
camps_route.get('/:id', function(req, res) {
    camps_with_info_db.findById(req.params.id).populate("comments").exec((err, camp) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect("/camp")
        } else {
            res.render("show", { camp: camp })
        }
    })
})

camps_route.put("/:id", [middlewares.isloggedin, middlewares.check_camp_ownership], function(req, res) {
    var new_camp_updated = {
        name: req.body.name,
        image: req.body.url,
        desc: req.body.desc,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }
    camps_with_info_db.findByIdAndUpdate(req.params.id, new_camp_updated).populate("comments").exec((err, camp) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect("back")
        } else
            res.redirect("/camp/" + camp._id)
    })
})
camps_route.get("/:id/edit", [middlewares.isloggedin, middlewares.check_camp_ownership], (req, res) => {
    camps_with_info_db.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect("back")
        } else
            res.render("camp_edit", { camp: camp })
    })
})
camps_route.delete("/:id", [middlewares.isloggedin, middlewares.check_camp_ownership], (req, res) => {
    camps_with_info_db.findByIdAndRemove(req.params.id, (err, camp) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect("back")
        }
        res.redirect("/camp")
    })
})

module.exports = camps_route