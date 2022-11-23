"use strict"

const Video = require("../models/Video");

module.exports = {

    get: (req, res) => {
        if (res.context.user) {
            const id = req.params.id;
            Video.findById(id)
                .then(video => {
                    if (res.context.user.id == video.creator) {
                        res.context.isCurrentUser = true;
                    }
                    else {
                        res.cookie("status", {
                            type: "error",
                            message: "ERROR: only the video creator can perform this action"
                        });
                        return res.redirect(res.context.prependURI + `/details/${id}`);
                    }
                    res.context.id = video._id;
                    res.context.title = video.title;
                    res.context.description = video.description;
                    res.context.imgURL = video.imgURL;
                    res.context.isPublic = video.isPublic;

                    res.render("edit-course", res.context);
                })
                .catch(err => {
                    console.error(err);
                    res.cookie("status", {
                        type: "error",
                        message: "ERROR: video could not be found"
                    });
                    res.redirect(res.context.prependURI + "/home");
                });
        }
        else {
            res.cookie("status", {
                type: "error",
                message: "ERROR: User must be logged in to access this page"
            });
            return res.redirect(res.context.prependURI + `/details/${id}`);
        }
    },

    post: (req, res) => {
        if (res.context.user) {
            const id = req.params.id;

            let updates = req.body;
            if (updates.isPublic == "on") req.body.isPublic = true;
            else req.body.isPublic = false;

            updates.title = updates.title.trim();
            updates.description = updates.description.trim();
            updates.imgURL = updates.imgURL.trim();

            if (updates.title.length < 4) {
                res.cookie("status", {
                    type: "warning",
                    message: "The title should be at least 4 characters"
                });
                return res.redirect(res.context.prependURI + `/edit/${id}`);
            }
            if (updates.description.length < 20) {
                res.cookie("status", {
                    type: "error",
                    message: "The description should be at least 20 characters long"
                });
                return res.redirect(res.context.prependURI + `/edit/${id}`);
            }
            if (!(updates.imgURL.startsWith("http://") || updates.imgURL.startsWith("https://"))) {
                res.cookie("status", {
                    type: "error",
                    message: "The image URL should start with http:// or https://"
                });
                return res.redirect(res.context.prependURI + `/edit/${id}`);
            }

            let newURL;
            if (updates.imgURL.includes("watch")) {
                let str = updates.imgURL;
                str = str.slice(str.indexOf("watch") + 8);
                newURL = "https://www.youtube.com/embed/" + str;
            }

            Video.findById(id)
                .then(video => {

                    if (res.context.user.id == video.creator) {
                        res.context.isCurrentUser = true;
                    }
                    else {
                        res.cookie("status", {
                            type: "error",
                            message: "ERROR: only the video creator can perform this action"
                        });
                        return res.redirect(res.context.prependURI + `/details/${id}`);
                    }

                    video.title = updates.title;
                    video.description = updates.description;
                    video.imgURL =  newURL || updates.imgURL;
                    video.isPublic = updates.isPublic;

                    video.save()
                        .then(video => {
                            res.cookie("status", {
                                type: "success",
                                message: "Update successful"
                            });
                            res.redirect(res.context.prependURI + `/details/${id}`);
                        })
                        .catch(err => {
                            console.error(err);
                            res.cookie("status", {
                                type: "error",
                                message: "ERROR: there was an problem trying to edit the video"
                            });
                            res.redirect(res.context.prependURI + `/edit/${id}`);
                        });
                })
                .catch(err => {
                    console.error(err);
                    res.cookie("status", {
                        type: "error",
                        message: "ERROR: video could not be found"
                    });
                    res.redirect(res.context.prependURI + "/home");
                });
        }
        else res.redirect(res.context.prependURI + "/home");
    },
}