const db = require("../models");
const Restaurant = db.Restaurant;
const Category = db.Category;
const Comment = db.Comment;
const User = db.User;
const Like = db.Like;
const pageLimit = 10;

let restController = {
  //瀏覽餐廳總表
  getRestaurants: (req, res) => {
    let offset = 0;
    let whereQuery = {};
    let categoryId = "";
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereQuery["CategoryId"] = categoryId;
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit,
    }).then((result) => {
      let page = Number(req.query.page) || 1;
      let pages = Math.ceil(result.count / pageLimit);
      let totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      );

      let prev = page - 1 < 1 ? 1 : page - 1;
      let next = page + 1 > pages ? pages : page + 1;

      const data = result.rows.map((r) => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map((d) => d.id).includes(
          r.id
        ),
        isLiked: req.user.LikedRestaurants.map((d) => d.id).includes(r.id),
        categoryName: r.Category.name,
      }));
      Category.findAll({
        raw: true,
        nest: true,
      }).then((categories) => {
        console.log(data);
        return res.render("restaurants", {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next,
        });
      });
    });
  },
  //瀏覽餐廳個別資料
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: "FavoritedUsers" },
        { model: User, as: "LikedUsers" },
      ],
    }).then((restaurant) => {
      const isFavorited = restaurant.FavoritedUsers.map((d) => d.id).includes(
        req.user.id
      );
      const isLiked = restaurant.LikedUsers.map((d) => d.id).includes(
        req.user.id
      );
      restaurant.increment("viewCount");
      return res.render("restaurant", {
        restaurant: restaurant.toJSON(),
        isFavorited: isFavorited,
        isLiked: isLiked,
      });
    });
  },
  //瀏覽最新動態
  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [["createdAt", "DESC"]],
      include: [Category],
    }).then((restaurants) => {
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [["createdAt", "DESC"]],
        include: [User, Restaurant],
      }).then((comments) => {
        return res.render("feeds", {
          restaurants: restaurants,
          comments: comments,
        });
      });
    });
  },
  //瀏覽餐廳看板
  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Comment, Category],
    }).then((restaurant) => {
      let results = restaurant.toJSON();
      console.log(results);
      const commentAmount = results.Comments.length;
      return res.render("dashboard", {
        results: results,
        commentAmount: commentAmount,
      });
    });
  },
};
module.exports = restController;
