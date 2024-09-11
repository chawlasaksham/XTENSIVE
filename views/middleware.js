const product = require("../models/listing");
const { productSchema } = require("../schema.js");

//checks is the user is logged in or not

module.exports.isloggedin = (req,res,next) =>{
    if(!req.isAuthenticated()){
      req.session.redirecturl = req.originalUrl;  
    req.flash("error","you must be logged in first");
    return res.redirect("/login");
    }
    next();
}

// session is used to save the current login info of user!!

module.exports.savedredirecturl = (req,res,next)=>{
    if(req.session.redirecturl){

    res.locals.redirectuser = req.session.redirecturl;}
    next();
}

//for seeing if user is ownner of listing 

module.exports.isOwner = async(req,res,next)=>{
  let { id } = req.params;
        let list = await product.findById(id);
        if(res.locals.curruser && !list.owner._id.equals(res.locals.curruser._id)){
            req.flash("error","you have no permission");
        return res.redirect(`/listings/${id}`);
        }
        next();
}

//check is the entered datails of procduct matches with schema

module.exports.validatelisting = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',');
      req.flash('error', msg);
      return res.redirect('/product/new');
  } else {
      next();
  }
};


