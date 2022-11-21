"use strict"

const mongoose = require("mongoose");
// const Subtitles = require("./Subtitles");

const videoSchema = new mongoose.Schema(
    {
        title : {type:String,required:true},
        description : {type:String,required:true},
        imgURL : {type:String,required:true},
        isPublic : {type:Boolean,required:true},
        createdAt : {type:Object,required:true},
        usersEnrolled : [{type:mongoose.Schema.Types.ObjectId, ref:"users"}],
        creator : {type:mongoose.Schema.Types.ObjectId, ref:"User", require: true}
    }
);

module.exports = mongoose.model("Video", videoSchema);

/* function makeRandomNum(string) {
    let sum = 0;
    for (let char of string) {
        sum += char.charCodeAt();
    }
    sum += parseInt(Math.random()*string.length);
    return sum;
} */