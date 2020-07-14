const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const restController = require("../controllers/restController.js");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");
const commentController = require("../controllers/commentController");
const multer = require("multer");
const upload = multer({ dest: "temp/" });

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
router.get("/", authenticated, (req, res) => res.redirect("/restaurants"));
router.get(
  //瀏覽全部餐廳
  "/restaurants",
  authenticated,
  restController.getRestaurants
);
router.get(
  //瀏覽最新動態
  "/restaurants/feeds",
  authenticated,
  restController.getFeeds
);
router.get(
  //瀏覽美食達人
  "/users/top",
  authenticated,
  userController.getTopUser
);
router.post(
  //追蹤美食達人
  "/following/:userId",
  authenticated,
  userController.addFollowing
);

router.delete(
  //取消追蹤美食達人
  "/following/:userId",
  authenticated,
  userController.removeFollowing
);

router.get(
  //瀏覽top餐廳
  "/restaurants/top",
  authenticated,
  userController.getTopRestaurants
);

router.get(
  //瀏覽個別餐廳
  "/restaurants/:id",
  authenticated,
  restController.getRestaurant
);
router.post(
  //新增評論
  "/comments",
  authenticated,
  commentController.postComment
);
router.delete(
  //刪除評論(限管理員)
  "/comments/:id",
  authenticateAdmin,
  commentController.deleteComment
);
router.get(
  //瀏覽帳戶資料
  "/users/:id",
  authenticated,
  userController.getUser
);
router.get(
  //編輯帳戶頁面
  "/users/:id/edit",
  authenticated,
  userController.editUser
);
router.put(
  //編輯帳戶
  "/users/:id",
  authenticated,
  upload.single("image"),
  userController.putUser
);
router.get(
  //瀏覽餐廳看板
  "/restaurants/:id/dashboard",
  authenticated,
  restController.getDashboard
);
router.post(
  //新增我的最愛
  "/favorite/:restaurantId",
  authenticated,
  userController.addFavorite
);
router.delete(
  //移除我的最愛
  "/favorite/:restaurantId",
  authenticated,
  userController.removeFavorite
);
router.post(
  //加入like
  "/like/:restaurantId",
  authenticated,
  userController.addLike
);
router.delete(
  //刪除like
  "/like/:restaurantId",
  authenticated,
  userController.removeLike
);

//後台路由
router.get("/admin", authenticateAdmin, (req, res) =>
  res.redirect("/admin/restaurants")
);
router.get(
  // 顯示餐廳
  "/admin/restaurants",
  authenticateAdmin,
  adminController.getRestaurants
);
router.get(
  // 建立餐廳頁面
  "/admin/restaurants/create",
  authenticateAdmin,
  adminController.createRestaurant
);
router.post(
  // 建立餐廳
  "/admin/restaurants",
  authenticateAdmin,
  upload.single("image"),
  adminController.postRestaurant
);
router.get(
  // 顯示個別餐廳
  "/admin/restaurants/:id",
  authenticateAdmin,
  adminController.getRestaurant
);
router.get(
  // 顯示餐廳編輯頁面
  "/admin/restaurants/:id/edit",
  authenticateAdmin,
  adminController.editRestaurant
);
router.put(
  // 編輯餐廳
  "/admin/restaurants/:id",
  authenticateAdmin,
  upload.single("image"),
  adminController.putRestaurant
);
router.delete(
  //刪除餐廳
  "/admin/restaurants/:id",
  authenticateAdmin,
  adminController.deleteRestaurant
);
router.get(
  //顯示使用者
  "/admin/users",
  authenticateAdmin,
  adminController.getUser
);
router.put(
  // 修改使用者權限
  "/admin/users/:id",
  authenticateAdmin,
  adminController.putUsers
);
router.get(
  //瀏覽分類
  "/admin/categories",
  authenticateAdmin,
  categoryController.getCategories
);
router.post(
  //新增分類
  "/admin/categories",
  authenticateAdmin,
  categoryController.postCategory
);
router.get(
  //編輯分類頁面
  "/admin/categories/:id",
  authenticateAdmin,
  categoryController.getCategories
);
router.put(
  //編輯分類
  "/admin/categories/:id",
  authenticateAdmin,
  categoryController.putCategory
);
router.delete(
  //刪除分類
  "/admin/categories/:id",
  authenticateAdmin,
  categoryController.deleteCategory
);

//註冊路由
router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp);
router.get("/admin/restaurants", adminController.getRestaurants);

//登入驗證路由
router.get("/signin", userController.signInPage);
router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  userController.signIn
);
router.get("/logout", userController.logout);

module.exports = router;
