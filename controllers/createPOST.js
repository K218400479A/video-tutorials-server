"use strict"

const Video = require("../models/Video");

module.exports = function (req, res) {
    const user = res.context.user;
    const fields = req.body;

    if (fields.title.length < 4) {
        res.context.type = "error";
        res.context.message = "The title should be at least 4 characters";
        res.context.title = fields.title;
        res.context.description = fields.description;
        res.context.imgURL = fields.imgURL;
        res.context.isPublic = fields.isPublic;
        return res.render("create-course", res.context);
    }
    if (fields.description.length < 20) {
        res.context.type = "error";
        res.context.message = "The description should be at least 20 characters long";
        res.context.title = fields.title;
        res.context.description = fields.description;
        res.context.imgURL = fields.imgURL;
        res.context.isPublic = fields.isPublic;
        return res.render("create-course", res.context);
    }
    if (!(fields.imgURL.startsWith("http://") || fields.imgURL.startsWith("https://"))) {
        res.context.type = "error";
        res.context.message = "The image URL should start with http:// or https://";
        res.context.title = fields.title;
        res.context.description = fields.description;
        res.context.imgURL = fields.imgURL;
        res.context.isPublic = fields.isPublic;
        return res.render("create-course", res.context);
    }

    let newURL;
    if (fields.imgURL.includes("watch")) {
        let str = fields.imgURL;
        str = str.slice(str.indexOf("watch") + 8);
        newURL = "https://www.youtube.com/embed/" + str;
    }

    if (fields.isPublic == "on") req.body.isPublic = true;
    else req.body.isPublic = false;
    new Video({
        title: fields.title,
        description: fields.description,
        imgURL: newURL || fields.imgURL,
        isPublic: fields.isPublic,
        createdAt: new Date(),
        usersEnrolled: fields.usersEnrolled,
        creator: user.id
    })
        .save()
        .then(data => {
            res.cookie("status", {
                type: "success",
                message: "Video created successfully"
            });
            res.redirect(res.context.prependURI + "/home")
        })
        .catch(err => {
            console.log(err);
        });
};