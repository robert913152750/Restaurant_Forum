const restController = require("../controllers/restController.js");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");

module.exports = (app, passport) => {
  //前台路由
  app.get("/", (req, res) => res.redirect("/restaurants"));

  app.get("/restaurants", restController.getRestaurants);
  //後台路由
  app.get("/admin", (req, res) => res.redirect("/admin/restaurants"));

  //註冊路由
  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);

  app.get("/admin/restaurants", adminController.getRestaurants);

  //登入驗證路由
  app.get("/signin", userController.signInPage);
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true,
    }),
    userController.signIn
  );
  app.get("/logout", userController.logout);
};
