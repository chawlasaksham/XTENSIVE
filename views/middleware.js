const product = require("../models/listing");
const expresserror = require("../utils/expresserror");
const { productSchema } = require("../schema.js");
//const Review = require("../models/reviews.js");
//const { reviewSchema } = require("../schema.js");

module.exports.isloggedin = (req,res,next) =>{
    if(!req.isAuthenticated()){
      req.session.redirecturl = req.originalUrl;  
    req.flash("error","you must be logged in first");
    return res.redirect("/login");
    }
    next();
}

module.exports.savedredirecturl = (req,res,next)=>{
    if(req.session.redirecturl){

    res.locals.redirectuser = req.session.redirecturl;}
    next();
}

//for seeing if user is qwner of listing 
module.exports.isOwner = async(req,res,next)=>{
  let { id } = req.params;
        let list = await product.findById(id);
        if(res.locals.curruser && !list.owner._id.equals(res.locals.curruser._id)){
            req.flash("error","you have no permission");
        return res.redirect(`/listings/${id}`);
        }
        next();
}


// module.exports.validatelisting = (req,res,next) =>{
//   let {error} = listingSchema.validate(req.body);
//   if(error){
//       let errmsg = error.details.map((el) =>el.message).join(",");
//       console.log(errmsg);
//       throw new expresserror(400,errmsg);
//   }
//   else{
//       next();
//   }
// }
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


// module.exports.validatereview = (req,res,next) =>{
//   let {error} = reviewSchema.validate(req.body);
//   if(error){
//       let errmsg = error.details.map((el) =>el.message).join(",");
//       console.log(errmsg);
//       throw new expresserror(400,errmsg);
//   }
//   else{
//       next();
//   }
// }

// module.exports.isreviewauthor = async(req,res,next)=>{
//   let { id,reviewId } = req.params;
//         let review = await Review.findById(reviewId);
//         if( !review.author.equals(res.locals.curruser._id)){
//             req.flash("error","you have no permission to delete it");
//         return res.redirect(`/listings/${id}`);
//         }
//         next();
// }