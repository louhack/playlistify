//middleware
var middlewareObj = {};

//middleware to test is user is already loggedin
middlewareObj.isLoggedIn = function (req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  console.log('Non authenticated request');
  res.redirect("/");
}

module.exports = middlewareObj;
