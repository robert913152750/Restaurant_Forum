const db = require("../models");
const Restaurant = db.Restaurant;
const Category = db.Category;

let restController = {
  //瀏覽餐廳總表
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category }).then((restaurants) => {
      const data = restaurants.map((r) => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name,
      }));
      console.log(data);
      return res.render("restaurants", {
        restaurants: data,
      });
    });
  },
  //瀏覽餐廳個別資料
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: Category }).then(
      (restaurant) => {
        return res.render("restaurant", {
          restaurant: restaurant.toJSON(),
        });
      }
    );
  },
};
module.exports = restController;
