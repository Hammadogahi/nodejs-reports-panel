const User = require("../models/users");
const multer = require("multer");
const jwt = require("jsonwebtoken");

//Error Handling

const handleError = (err) => {
  console.log(err.message, err.code);
  let errors = {
    name: "",
    email: "",
    password: "",
    name: "",
    file: "",
    phone: "",
  };

  if (err.message === "Incorrect email") {
    errors.email = "The Email is not registered yet";
  }

  if (err.message === "Incorrect password") {
    errors.password = "The Password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "This email is already registered";
    return errors;
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
const maxAge = 3 * 24 * 60 * 60; // 3 Days value
const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: maxAge,
    }
  );
};

//Routes Controllers
module.exports.getLogin = (req, res) => {
  const user = res.locals.user;
  if (user) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("index", {
      title: "Login",
    });
  }
};

module.exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({
      errors,
    });
  }
};

module.exports.getRegister = (req, res) => {
  const user = res.locals.user;
  if (user) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("register", {
      title: "Register",
    });
  }
};

module.exports.postRegister = async (req, res) => {
  //const file = req.file && req.file.path;
  const { name, email, password } = req.body;
  const phone = req.body.phone || "N/A";
  try {
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(500).json({ errors });
  }
};

module.exports.getLogOut = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
