var comment_route = require("express").Router({ mergeParams: true }),
    camps_with_info_db = require("../models/camps"),
    comments_db = require("../models/comment"),
    middlewares = require("../middlewares/index")
comment_route.get("/new", middlewares.isloggedin, (req, res) => {
    camps_with_info_db.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect('back')
        } else {
            res.render("comment_new.ejs", { camp: camp })
        }
    })
})
comment_route.post("/", middlewares.isloggedin, (req, res) => {
    camps_with_info_db.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect('back')
        } else {
            var comm = {
                title: req.body.title,
                author: {
                    id: req.user._id,
                    username: req.user.username
                }
            }
            comments_db.create(comm, (err, comment) => {
                if (err) {
                    console.log(err)
                    req.flash("error", err.message)
                    res.redirect('back')
                } else {
                    camp.comments.push(comment)
                    camp.save();
                    res.redirect("/camp/" + req.params.id)
                }
            })
        }
    })

})
comment_route.get("/:comment_id/edit", [middlewares.isloggedin, middlewares.check_comment_ownership], (req, res) => {
    camps_with_info_db.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect('back')
        } else {
            comments_db.findById(req.params.comment_id, (err, comm) => {
                if (err) {
                    console.log(err)
                    req.flash("error", err.message)
                    res.redirect('back')
                } else
                    res.render("comment_edit", { comm: comm, camp: camp })
            })
        }
    })
})
comment_route.put("/:comment_id", (req, res) => {
    comments_db.findByIdAndUpdate(req.params.comment_id, {
        author: {
            id: req.user._id,
            username: req.user.username
        },
        title: req.body.updated_title
    }, (err, comm) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect('back')
        } else
            res.redirect("/camp/" + req.params.id)
    })
})
comment_route.delete("/:comment_id", [middlewares.isloggedin, middlewares.check_comment_ownership], (req, res) => {
    comments_db.findByIdAndDelete(req.params.comment_id, (err) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect('back')
        } else
            res.redirect("/camp/" + req.params.id)
    })
})
module.exports = comment_route