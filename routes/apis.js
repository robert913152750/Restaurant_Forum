const express = require("express");
const router = express.Router();
const adminController = require("../controllers/api/adminController");
const categoryController = require("../controllers/api/categoryController");
const multer = require("multer");
const upload = multer({ dest: "temp/" });

router.get("/admin/restaurants", adminController.getRestaurants);
router.get("/admin/restaurants/:id", adminController.getRestaurant);
router.get("/admin/categories", categoryController.getCategories);
router.delete("/admin/restaurants/:id", adminController.deleteRestaurant);
router.post(
  "/admin/restaurants",
  upload.single("image"),
  adminController.postRestaurant
);
router.put(
  // 編輯餐廳
  "/admin/restaurants/:id",
  upload.single("image"),
  adminController.putRestaurant
);
router.post(
  //新增分類
  "/admin/categories",
  categoryController.postCategory
);

module.exports = router;
