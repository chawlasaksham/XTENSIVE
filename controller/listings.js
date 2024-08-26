const { response } = require("express");
const Listing = require("../models/listing");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_token = process.env.map_token;
const geocodingClient = mbxgeocoding({ accessToken: map_token });

module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
     res.render("listings/index.ejs", { alllistings });
};


module.exports.rendernewform = (req, res) => {
    
    
    res.render("listings/new.ejs");
}

module.exports.showlist = async (req, res) => {
    let { id } = req.params;
    const listing= await Listing.findById(id)
        .populate({path:"reviews",
            populate:{path:"author",}
        })
        .populate("owner");
    if(!listing){
        req.flash("error","listing not found");
        res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createlist = async (req, res,next) => 
    {  let resp = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send();

    //console.log(resp.body.features[0].geometry);
      
        let url = req.file.path;
        let filename = req.file.filename;
       
    const newlisting = new Listing(req.body.listing);   
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    newlisting.geometry = resp.body.features[0].geometry;
     let savedlisting = await newlisting.save();
     console.log(savedlisting);
     req.flash("success","new listing");
     res.redirect("/listings");   
  }

module.exports.editlist =async (req, res) => 
    {
     let { id } = req.params;
     
     const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","listing not found");
        res.redirect("/listings");
    }
    let origurl = listing.image.url;
    origurl = origurl.replace("/upload","/upload/w_250")
     res.render("listings/edit.ejs", { listing ,origurl});
 }


 module.exports.updatelist = async (req, res) => {    
    let { id } = req.params;
        
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefinned"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};

    await listing.save();}

    req.flash("success","updated listing");
    res.redirect(`/listings/${id}`);
 }


 
 module.exports.deletelist = async (req, res) => {
    let { id } = req.params;
   
    await Listing.findByIdAndDelete(id);
    req.flash("success","deleted listing");
    res.redirect(`/listings`);
}