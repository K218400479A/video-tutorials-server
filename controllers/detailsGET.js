"use strict"

const Video = require("../models/Video");

module.exports = function (req, res) {
    if (res.context.user) {
        const id = req.params.id;
        Video.findById(id)
            .then(video => {

                if (res.context.user.id == video.creator) {
                    res.context.isCurrentUser = true;
                }
                if (video.usersEnrolled.includes(res.context.user.id)) {
                    res.context.enrolled = true;
                }

                res.context.id = video._id;
                res.context.title = video.title;
                res.context.description = video.description;
                res.context.imgURL = video.imgURL;
                res.context.isPublic = video.isPublic;

                res.render("course-details", res.context);
            })
            .catch(err => {
                console.error(err);
                res.cookie("status", {
                    type: "error",
                    message: "ERROR: video could not be found"
                });
                res.redirect("/");
            });

    }
    else res.redirect("/");
};