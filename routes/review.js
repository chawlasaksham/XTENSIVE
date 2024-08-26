const express = require("express");
const wrapAsync = require("../utils/wrapasync");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing");
const router = express.Router({mergeParams: true});
const {
    validatereview, 
    isloggedin,
    isreviewauthor
}= require("../views/middleware.js");

const reviewcontroller = require("../controller/review.js");

//post review
router.post("/",
    validatereview,
    isloggedin,
    
    wrapAsync(reviewcontroller.createreview));
  

//delete review
router.delete(
    "/:reviewId",
    isloggedin,
    isreviewauthor,
     wrapAsync (reviewcontroller.deletereview));


module.exports = router;