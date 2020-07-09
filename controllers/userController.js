const bcrypt = require("bcryptjs");
const db = require("../models");
const user = require("../models/user");
const User = db.User;

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
    return User.findByPk(req.params.id).then((user) => {
      return res.render("userProfile", {
        user: user.toJSON(),
      });
    });
  },
};

module.exports = userController;
