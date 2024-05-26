const jwt = require("jsonwebtoken");
const User = require("../models/users.js");

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        console.log(err.message);
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const requireAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    const user = res.locals.user;
    if (!user) {
      res.redirect("/");
    } else {
      req.userId = user.id;
      next();
    }
  });
};

const checkUser = (req, res, next) => {
  verifyToken(req, res, next);
};

const checkAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    const user = res.locals.user;
    if (!user) {
      res.redirect("/");
    } else if (user.isAdmin) {
      next(); // Proceed to the next middleware or route handler
    } else {
      res.redirect("/user/dashboard");
    }
  });
};
module.exports = { requireAuth, checkUser, checkAdmin };
