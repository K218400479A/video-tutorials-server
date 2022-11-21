"use strict"

const Video = require("../models/Video");
const User = require("../models/User");



module.exports = (req, res) => {
    if (res.context.user) {
        const userID = res.context.user.id;
        const videoID = req.params.id;

        let a = Video.findById(videoID)
            .then(video => {
                video.usersEnrolled.push(userID);
                video.save();
            })
            .catch(err => console.error(err));
        let b = User.findById(userID)
            .then(user => {
                user.videosEnrolled.push(videoID);
                user.save();
            })
            .catch(err => console.error(err));

        Promise.all([a, b]).then(value => {
            return res.redirect(`/details/${videoID}`);
        });

    }

    else res.redirect("/");
};