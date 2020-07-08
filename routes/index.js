const restController = require("../controllers/restController.js");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");
const commentController = require("../controllers/commentController");
const multer = require("multer");
const upload = multer({ dest: "temp/" });

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
  app.get(
    //瀏覽全部餐廳
    "/restaurants",
    authenticated,
    restController.getRestaurants
  );
  app.get(
    //瀏覽個別餐廳
    "/restaurants/:id",
    authenticated,
    restController.getRestaurant
  );
  app.post(
    //新增評論
    "/comments",
    authenticated,
    commentController.postComment
  );
  app.delete(
    //刪除評論(限管理員)
    "/comments/:id",
    authenticateAdmin,
    commentController.deleteComment
  );

  //後台路由
  app.get("/admin", authenticateAdmin, (req, res) =>
    res.redirect("/admin/restaurants")
  );
  app.get(
    // 顯示餐廳
    "/admin/restaurants",
    authenticateAdmin,
    adminController.getRestaurants
  );
  app.get(
    // 建立餐廳頁面
    "/admin/restaurants/create",
    authenticateAdmin,
    adminController.createRestaurant
  );
  app.post(
    // 建立餐廳
    "/admin/restaurants",
    authenticateAdmin,
    upload.single("image"),
    adminController.postRestaurant
  );
  app.get(
    // 顯示個別餐廳
    "/admin/restaurants/:id",
    authenticateAdmin,
    adminController.getRestaurant
  );
  app.get(
    // 顯示餐廳編輯頁面
    "/admin/restaurants/:id/edit",
    authenticateAdmin,
    adminController.editRestaurant
  );
  app.put(
    // 編輯餐廳
    "/admin/restaurants/:id",
    authenticateAdmin,
    upload.single("image"),
    adminController.putRestaurant
  );
  app.delete(
    //刪除餐廳
    "/admin/restaurants/:id",
    authenticateAdmin,
    adminController.deleteRestaurant
  );
  app.get(
    //顯示使用者
    "/admin/users",
    authenticateAdmin,
    adminController.getUser
  );
  app.put(
    // 修改使用者權限
    "/admin/users/:id",
    authenticateAdmin,
    adminController.putUsers
  );
  app.get(
    //瀏覽分類
    "/admin/categories",
    authenticateAdmin,
    categoryController.getCategories
  );
  app.post(
    //新增分類
    "/admin/categories",
    authenticateAdmin,
    categoryController.postCategory
  );
  app.get(
    //編輯分類頁面
    "/admin/categories/:id",
    authenticateAdmin,
    categoryController.getCategories
  );
  app.put(
    //編輯分類
    "/admin/categories/:id",
    authenticateAdmin,
    categoryController.putCategory
  );
  app.delete(
    //刪除分類
    "/admin/categories/:id",
    authenticateAdmin,
    categoryController.deleteCategory
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
