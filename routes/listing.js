const express = require("express");
const wrapasync = require("../utils/wrapasync");
const wrapAsync = require("../utils/wrapasync");

const Listing = require("../models/listing");
const router = express.Router();
const {isloggedin, isOwner,validatelisting}= require("../views/middleware.js");
const listingcontroller = require("../controller/listings.js");
const multer  = require('multer');
const {storage}= require("../cloudconfig.js");


const upload = multer({ storage });

router
   .route("/")
   //index routes
   .get(wrapAsync (listingcontroller.index))
   //Create route
   .post(
      isloggedin,
      upload.single('listing[image][filename]'),
      validatelisting,
      wrapAsync(listingcontroller.createlist));
   

// New route
router.get("/new",isloggedin,listingcontroller.rendernewform );



router
   .route("/:id")   

   // Show route
   .get(wrapasync(listingcontroller.showlist))

   //update
   .put(
   isloggedin,
   isOwner,
   upload.single('listing[image][filename]'),
   validatelisting, 
   wrapAsync(listingcontroller.updatelist))

   // Delete route
   .delete(
      isloggedin,
      isOwner,
      wrapasync(listingcontroller.deletelist));





 
 // Edit Route
 router.get(
    "/:id/edit",
    isloggedin,
    isOwner,
    
    wrapasync(listingcontroller.editlist));
 
module.exports = router;