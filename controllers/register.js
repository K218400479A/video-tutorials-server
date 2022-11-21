"use strict"

const bcrypt = require("bcrypt");
const saltConfig = require("../config/config").saltRounds;
const User = require("../models/User");
const { validationResult } = require("express-validator");

module.exports = (req, res) => {
    console.log(req.body);
    let username = req.body.username;
    let pass = req.body.password;
    let rePass = req.body.repeatPassword;

    User.find({ username: username }).then(users => {
        let { errors } = validationResult(req);

        if (users.length > 0) {
            res.context.type = "warning";
            res.context.message = "Username already exists";
            return res.render("register", res.context);
        }

        if (errors.length > 0) {
            if (errors[0].param == "username") {
                res.context.type = "error";
                res.context.message = "USERNAME must be at least 5 alphanumeric characters";
            }
            else {
                res.context.type = "error";
                res.context.message = "PASSWORD must be at least 5 alphanumeric characters";
            }
            console.log(errors);
            return res.render("register", res.context);
        }

        if (pass == rePass) {
            bcrypt.genSalt(saltConfig, (err, salt) => {
                bcrypt.hash(pass, salt, (err, hash) => {
                    console.log(hash);
                    new User({
                        username,
                        password: hash,
                        enrolled: []
                    })
                        .save()
                        .then(user => {
                            res.status(201);
                            console.log(`User was created successfully`);
                            console.log(user);

                            res.cookie("status", {
                                type: "success",
                                message: "User created, please log in"
                            });

                            res.redirect("/login");
                            // res.end();
                        })
                        .catch(err => { console.log(err) });
                });
            });
        }
        else {
            res.context.type = "error";
            res.context.message = "PASSWORDS have to match";
            res.render("register", res.context);
        }
    });
}