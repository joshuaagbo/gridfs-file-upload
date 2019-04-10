const express = require("express");
const passport = require("passport");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const port = process.env.PORT || 4300;
const router = require("./router");
const mongoose = require("mongoose");
const {
  mongoURI
} = require("./config/keys").mongodb;

const app = express();
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true
  })
  .then(() => console.log("Db connected"))
  .catch(err => console.log("NEW_MONGO_ERROR::", err));
/******  MIDDLEWARES ******/
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
// use session
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
// use flash
app.use(flash());
// set messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.error = req.flash("error");
  next();
});
// USE PASSPORT;
app.use(passport.initialize());
app.use(passport.session());
require("./config/auth_google")(passport);
// SET VIEW ENGINE;
app.set("view engine", "pug");
// SET STATIC ASSET
app.use(express.static(path.resolve(__dirname, "statics")));
app.use("", router);
app.listen(port, () => console.log(`Server started at port ${port}`));