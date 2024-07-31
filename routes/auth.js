const { Router } = require("express");
const passport = require("passport");
const router = new Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    //here we can get our user bcoz passport attaches user with request
    const user=req.user;
    if(!(user.role===0 || user.role===1)){
      return res.redirect("/signup");
    }
    res.redirect("/dashboard");
  }
);
router.get("/logout",(req,res)=>{
  //passport adds a function i.e logout which receives a callback
  req.logout(()=>{
    res.redirect("/");
  });
});
module.exports = router;
