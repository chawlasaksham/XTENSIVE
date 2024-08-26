const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const {saveredirectusrl, savedredirecturl} = require("../views/middleware.js");
const usercontroller = require("../controller/user.js");


router
    .route("/signup")
    .get(usercontroller.rendersignupform)
    .post(wrapasync(usercontroller.signupuser));


router
    .route("/login")
    
    .post(savedredirecturl,
    passport.authenticate("local",
        {failureRedirect: '/login',
        failureFlash: true
    }), 
    usercontroller.loginuser)

    .get(usercontroller.renderloginform);

router.get("/logout",usercontroller.logoutuser)

module.exports = router;