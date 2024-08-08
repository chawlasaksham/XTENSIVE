const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync");
const expresserror = require("./utils/expresserror");

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to db");
}

main().catch(err => {
    console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("root is working");
});

app.get("/listings", async (req, res) => {
    const alllistings = await Listing.find({});
     res.render("listings/index.ejs", { alllistings });
   //
});

// New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create route
app.post("/listings", wrapAsync(async (req, res,next) => {
    if(!req.body.listings){
        new expresserror(400,"send valid data for listing");
    }
   const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");   
}));

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

// Update route
app.put("/listings/:id", async (req, res) => {
    if(!req.body.listings){
        new expresserror(400,"send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

// Delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
});

// Show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

app.all("*" ,(req,res,next)=>{
    next(new expresserror(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {statuscode =500,message="wrong"} = err;
  res.status(statuscode).render("listings/error.ejs" ,{err})
    // res.status(statuscode).send(message);
})

    
app.listen(8080, () => {
    console.log("server is listening on port 8080");
   });
