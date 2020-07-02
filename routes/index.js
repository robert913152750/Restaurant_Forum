const restController = require("../controllers/restController.js");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");

module.exports = (app, passport) => {
  //身分驗證middleware
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/signin");
  };
  const authenticateAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next();
      }
      return res.redirect("/");
    }
    res.redirect("/signin");
  };

  //前台路由
  app.get("/", authenticated, (req, res) => res.redirect("/restaurants"));
  app.get("/restaurants", authenticated, restController.getRestaurants);

  //後台路由
  app.get("/admin", authenticateAdmin, (req, res) =>
    res.redirect("/admin/restaurants")
  );
  app.get(
    "/admin/restaurants",
    authenticateAdmin,
    adminController.getRestaurants
  );
  app.get(
    "/admin/restaurants/create",
    authenticateAdmin,
    adminController.createRestaurant
  );
  app.post(
    "/admin/restaurants",
    authenticateAdmin,
    adminController.postRestaurant
  );

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
