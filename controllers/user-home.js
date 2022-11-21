"use strict"

const Video = require("../models/Video");

module.exports = function (req, res) {


    Video.find().then(data => {
        let videoArray = data.map(video => {
            let subVid = {
                id: video._id,
                title: video.title,
                description: video.description,
                imgURL: video.imgURL,
                isPublic: video.isPublic,
                createdAt: video.createdAt,
                usersEnrolled: video.usersEnrolled,
                creator: video.creator
            }
            return subVid;
        });

        videoArray = videoArray.filter(video => {
            return video.isPublic == true || video.creator == res.context.user.id;
        });
        videoArray.sort((b, a) => {
            if (a.createdAt.valueOf() > b.createdAt.valueOf()) return 1;
            if (a.createdAt.valueOf() < b.createdAt.valueOf()) return -1;
            return 0;
        });

        res.context.videos = videoArray;
        res.render("user-home", res.context);
    });
};