const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const router = require("./routes/routes");
const flash = require("connect-flash");

//Routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.static(__dirname + "/public"));
app.use(express.static("uploads"));

//DATABASE CONNECTION

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("DB CONNECTED SUCCESSFULLY");
  })
  .catch((err) => {
    console.log(err);
  });

//MIDDLEWARES

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 60000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

//set template engine

app.set("view engine", "ejs");

app.use("", router);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

app.listen( 5000, () => {
  console.log('App is running at port 5000');
});
