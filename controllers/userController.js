const bcrypt = require("bcryptjs");
const db = require("../models");
const user = require("../models/user");
const User = db.User;
const Comment = db.Comment;
const Restaurant = db.Restaurant;
const Favorite = db.Favorite;
const Like = db.Like;
const Followship = db.Followship;
const fs = require("fs");
const imgur = require("imgur-node-api");
const category = require("../models/category");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const userController = {
  signUpPage: (req, res) => {
    return res.render("signup");
  },
  signUp: (req, res) => {
    // confirm password
    console.log(req.body);
    if (req.body.passwordCheck !== req.body.password) {
      req.flash("error_messages", "兩次密碼不同");
      return res.redirect("/signup");
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user) {
          req.flash("error_messages", "信箱重複");
          return res.redirect("/signup");
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            ),
          }).then((user) => {
            req.flash("success_messages", "成功註冊帳號");
            return res.redirect("/signin");
          });
        }
      });
    }
  },
  signInPage: (req, res) => {
    return res.render("signin");
  },
  signIn: (req, res) => {
    req.flash("success_messages", "成功登入!");
    console.log(res.locals);
    res.redirect("/restaurants");
  },
  logout: (req, res) => {
    req.flash("success_messages", "登出成功");
    req.logout();
    res.redirect("/signin");
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: Comment, include: [Restaurant] }],
    }).then((user) => {
      let results = user.toJSON();
      let resCount = user.Comments.length;
      return res.render("userProfile", {
        userPageId: req.params.id.toString(),
        passportUser: req._passport.session.user.toString(),
        results: results,
        resCount: resCount,
      });
    });
  },
  editUser: (req, res) => {
    if (req.params.id == req._passport.session.user) {
      return User.findByPk(req.params.id).then((user) => {
        return res.render("userEdit", {
          user: user.toJSON(),
        });
      });
    } else {
      req.flash(
        "error_messages",
        "You don't have the authority to do this action "
      );
      return res.redirect("back");
    }
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", "name didn't exist");
      return res.redirect("back");
    }
    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then((user) => {
          user
            .update({
              name: req.body.name,
              image: file ? img.data.link : user.image,
            })
            .then((user) => {
              req.flash(
                "success_messages",
                "user profile was successfully to update"
              );
              res.redirect(`/users/${req.params.id}`);
            });
        });
      });
    } else {
      return User.findByPk(req.params.id).then((user) => {
        user
          .update({
            name: req.body.name,
            image: user.image,
          })
          .then((user) => {
            req.flash(
              "success_messages",
              "user profile was successfully to update"
            );
            res.redirect(`/users/${req.params.id}`);
          });
      });
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
    }).then((restaurant) => {
      return res.redirect("back");
    });
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((favorite) => {
      favorite.destroy().then((restaurant) => {
        return res.redirect("back");
      });
    });
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
    }).then((like) => {
      return res.redirect("back");
    });
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((like) => {
      like.destroy().then((like) => {
        return res.redirect("back");
      });
    });
  },
  getTopUser: (req, res) => {
    return User.findAll({
      include: [{ model: User, as: "Followers" }],
    }).then((users) => {
      users = users.map((user) => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map((d) => d.id).includes(user.id),
      }));
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount);
      return res.render("topUser", { users: users });
    });
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId,
    }).then((followship) => {
      return res.redirect("back");
    });
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId,
      },
    }).then((followship) => {
      followship.destroy().then((followship) => {
        return res.redirect("back");
      });
    });
  },
  getTopRestaurants: (req, res) => {
    Restaurant.findAll({
      limit: 10,
      include: [{ model: User, as: "FavoritedUsers" }],
    }).then((restaurants) => {
      restaurants = restaurants.map((restaurant) => ({
        ...restaurant.dataValues,
        FavoriteCount: restaurant.FavoritedUsers.length,
        isFavorited: req.user.FavoritedRestaurants.map((d) => d.id).includes(
          restaurant.id
        ),
        shortDescription: restaurant.dataValues.description.substring(0, 50),
      }));
      restaurants = restaurants.sort(
        (a, b) => b.FavoriteCount - a.FavoriteCount
      );
      console.log(restaurants);
      return res.render("topRestaurant", { restaurants: restaurants });
    });
  },
};

module.exports = userController;
