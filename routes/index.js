const restController = require("../controllers/restController.js");
const adminController = require("../controllers/adminController");

module.exports = (app) => {
  //前台路由
  app.get("/", (req, res) => res.redirect("/restaurants"));

  app.get("/restaurants", restController.getRestaurants);
  //後台路由
  app.get("/admin", (req, res) => res.redirect("/admin/restaurants"));

  app.get("/admin/restaurants", adminController.getRestaurants);
};
