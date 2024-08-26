const User = require("../models/user.js");

module.exports.rendersignupform = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signupuser = async(req,res)=>{
    try{  let{username, email, password}= req.body;
      const newuser = new User({email,username});
      const registeredUser = await  User.register(newuser,password);
      
      
      req.login(registeredUser, (err)=>{
          if(err){
              return err;
          }
      
          req.flash("success", "Welcome to Round-About");
          res.redirect("/listings");
      })
      }
      catch(e){
          req.flash("error", e.message);
          res.redirect("/signup");
      }
  
  
  }

module.exports.loginuser = async(req,res)=>{
    req.flash("success","welcome back to Round-About");
    const redirecturl = res.locals.redirectuser || "/listings";
    res.redirect(redirecturl);
 }

 module.exports.renderloginform =(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.logoutuser =(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next();
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
}