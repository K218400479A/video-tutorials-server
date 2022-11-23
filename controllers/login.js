
"use strict"

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/config").jwt;
const saltConfig = require("../config/config").saltRounds;
const User = require("../models/User");

module.exports = (req, res) => {
    // console.log(req.body);
    let username = req.body.username;
    let pass = req.body.password;

    User.findOne({ username })
        .then(user => {
            if (user != null) {
                bcrypt.compare(pass, user.password, (err, result) => {
                    // console.log(result);
                    if (result) {
                        res.status(200);
                        let userToken = {
                            id: user._id,
                            username: user.username,
                        }
                        const token = jwt.sign(userToken, jwtConfig.secret, jwtConfig.options);
                        res.cookie("user", token);
                        res.cookie("status", {
                            type: "success",
                            message: "Login successful"
                        });
                        res.redirect(res.context.prependURI + "/");
                    }
                    else {
                        res.status(406);
                res.context.type = "warning";
                res.context.message = "Incorrect password";
                res.context.username = username;
                res.render("login", res.context);
                    }
                });
            }
            else {
                res.status(406);
                res.context.type = "warning";
                res.context.message = "Username could not be found";
                res.context.username = username;
                res.context.pass = pass;
                res.render("login", res.context);
            }
        })
        .catch(err => console.log(err));

}