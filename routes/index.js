const restController = require("../controllers/restController.js");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");

module.exports = (app) => {
  //前台路由
  app.get("/", (req, res) => res.redirect("/restaurants"));

  app.get("/restaurants", restController.getRestaurants);
  //後台路由
  app.get("/admin", (req, res) => res.redirect("/admin/restaurants"));

  //註冊路由
  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);

  app.get("/admin/restaurants", adminController.getRestaurants);
};
