const db = require("../models");
const Restaurant = db.Restaurant;
const Category = db.Category;

let restController = {
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
};
module.exports = restController;
