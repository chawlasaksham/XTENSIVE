if(process.env.NODE_env!= "production"){
require("dotenv").config();}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const expresserror = require("./utils/expresserror");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.atlas_url_db;
const secret = process.env.secret;

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:secret
    },
    touchAfter:24*3600 //for not updating data after refresh
}) 

store.on("error",()=>{
    console.log("err in mongo store");
})

const sessionOptions = {
    store:store,
    secret:secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const listingsrouter = require("./routes/listing.js")
const reviewsrouter = require("./routes/review.js");
const usersrouter = require("./routes/user.js");


//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(dbUrl);
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

app.get("/register", async(req,res)=>{
    let fake = new User({
        emailid:"stud@gamil.com",
        username: "student", 
    })

    let registereduser = await User.register(fake,"saksham");
    res.send(registereduser);
})

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
})


//listing
app.use("/listings",listingsrouter);
//reviews
app.use("/listings/:id/reviews",reviewsrouter);
//users
app.use("/",usersrouter);

app.all("*" ,(req,res,next)=>{
    next(new expresserror(404,"page not found"));
})

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "Something went wrong" } = err;
    res.status(statuscode).json({ message, details: err.details });
});

app.listen(8080, () => {
    console.log("erver is listening on port 8080");
   });
