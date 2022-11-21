"use strict"

//packages
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');

//constants
const jwtConfig = require("./config").jwt;

//controllers
const createPOST = require("../controllers/createPOST");
const detailsGET = require("../controllers/detailsGET");
const guestHome = require("../controllers/guest-home");
const login = require("../controllers/login");
const register = require("../controllers/register");
const userHome = require("../controllers/user-home");
const edit = require("../controllers/edit");
const deletePOST = require("../controllers/deletePOST");
const enrollPOST = require("../controllers/enrollPOST");



module.exports = (app) => {

    app.use((req, res, next) => {
        res.context = {};
        if (req.cookies.user) {
            let decodedJWT = jwt.verify(req.cookies.user, jwtConfig.secret);
            res.context = {
                loggedIn: true,
                user: {
                    id: decodedJWT.id,
                    username: decodedJWT.username
                }
            }
        }
        if (req.cookies.status) {
            res.context.type = req.cookies.status.type;
            res.context.message = req.cookies.status.message;
            res.clearCookie("status");
        }
        if (res.context.type == undefined) {
            res.context.type = "none";
            res.context.message = "";
        }

        next();
    });

    // HOME
    app.get("/", function (req, res) {
        if (res.context.user) userHome(req, res);
        else guestHome(req, res);
    });

    // DETAILS
    app.get("/details/:id", detailsGET);

    // CREATE
    app.get("/create", function (req, res) {
        if (res.context.user) res.render("create-course", res.context);
        else {
            res.cookie("status", {
                type: "warning",
                message: "Not logged in"
            });
            res.redirect("/");
        }
    });
    app.post("/create", createPOST);

    // EDIT
    app.get("/edit/:id", edit.get);
    app.post("/edit/:id", edit.post);

    // DELETE
    app.post("/delete/:id", deletePOST);

    // ENROLL
    app.post("/enroll/:id", enrollPOST);

    // LOGIN
    app.get("/login", function (req, res) {
        if (!res.context.user) res.render("login", res.context);
        else {
            res.cookie("status", {
                type: "warning",
                message: "Already logged in"
            });
            res.redirect("/");
        }
    });
    app.post("/login", login);

    // LOGOUT
    app.get("/logout", (req, res) => {
        res.clearCookie("user");
        res.cookie("status", {
            type: "success",
            message: "Successfully logged out"
        });
        res.redirect("/");
    });

    // REGISTER
    app.get("/register", function (req, res) {
        if (!res.context.user) res.render("register", res.context);
        else {
            res.cookie("status", {
                type: "warning",
                message: "Already logged in"
            });
            res.redirect("/");
        }
    });
    app.post("/register",
        body('username').trim().isLength({ min: 5 }).isAlphanumeric(),
        body('password').trim().isLength({ min: 5 }).isAlphanumeric(),
        register);

    // 404
    app.get("*", function (req, res) {
        res.render("404", res.context);
    });
};