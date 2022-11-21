const mongoose = require("mongoose");
const config = require("./config");


module.exports = (app) => {
    mongoose.connect(config.database || "mongodb://localhost:27017/videos");
};