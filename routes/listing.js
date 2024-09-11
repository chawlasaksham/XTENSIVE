const express = require("express");
const wrapAsync = require("../utils/wrapasync");
const router = express.Router();
const { isloggedin, isOwner, validatelisting } = require("../views/middleware.js");
const listingcontroller = require("../controller/listings.js");
const multer = require('multer');
const { storage } = require("../cloudconfig.js");

const upload = multer({ storage });

// Route for listing index and creating a listing
router
   .route("/")
   // Index route
   .get(
      isloggedin,
      wrapAsync(listingcontroller.index))
   // Create route
   .post(
      isloggedin,
      upload.single('product[image]'), // Ensure this matches the form field name
      validatelisting,
      wrapAsync(listingcontroller.createlist)
   );

router
   .route("/display/table")
   // Index route
   .get(
   isloggedin,
   wrapAsync(listingcontroller.indextable))



router
   .route("/:category/sort")
   // Index route for sorting
   .get(
      isloggedin,
      wrapAsync(listingcontroller.sortlist));


router
      .route("/:category/sort/table")
      // Index route for sorting
      .get(
         isloggedin,
         wrapAsync(listingcontroller.indextablesort));
   

router
   .route("/search/:sku")
   // Index route for searching
   .get(
      isloggedin,
      wrapAsync(listingcontroller.searchSku));

// Route to render the new listing form
router.get("/new", isloggedin, listingcontroller.rendernewform);

// Routes for individual listings by ID
router
   .route("/:id")
   // Show route
   .get(wrapAsync(listingcontroller.showlist))
   // Update route
   .put(
      isloggedin,
      isOwner,
      upload.single('product[image][filename]'), // Ensure this matches the form field name
      validatelisting,
      wrapAsync(listingcontroller.updatelist)
   )
   // Delete route
   .delete(
      isloggedin,
      isOwner,
      wrapAsync(listingcontroller.deletelist)
   );

// Route to render the edit form for a listing
router.get(
   "/:id/edit",
   isloggedin,
   isOwner,
   wrapAsync(listingcontroller.siteguide)
);

router.get(
   "/help/guide",
   isloggedin,
   wrapAsync(listingcontroller.siteguide)
);

module.exports = router;
