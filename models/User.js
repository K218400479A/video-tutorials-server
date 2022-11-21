"use strict"

const mongoose = require("mongoose");
const Video = require("./Video");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        videosEnrolled: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "videos"
        }]
    }
);

module.exports = mongoose.model("User", userSchema);