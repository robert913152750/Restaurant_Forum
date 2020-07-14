const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const db = require("./models");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport");
const methodOverride = require("method-override");
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    helpers: require("./config/handlebars-helpers"),
  })
);
app.set("view engine", "handlebars");

app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = req.user;
  next();
});

app.use(methodOverride("_method"));

app.use("/upload", express.static(__dirname + "/upload"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

require("./routes")(app);
