"use strict"

const Video = require("../models/Video");



module.exports = (req, res) => {
    if (res.context.user) {
        const id = req.params.id;
        Video.findByIdAndRemove(id)
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
                res.cookie("status", {
                    type: "success",
                    message: "Successfully deleted video"
                });
                res.redirect(res.context.prependURI + "/");
            })
            .catch(err => {
                console.error(err);
                res.cookie("status", {
                    type: "error",
                    message: "ERROR: video could not be found"
                });
                res.redirect(res.context.prependURI + "/");
            });
    }
    else res.redirect(res.context.prependURI + "/");
}