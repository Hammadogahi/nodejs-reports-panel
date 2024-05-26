const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const reportsController = require("../controllers/reportsController");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

//Get  Login page
router.get("*", checkUser);
router.get("/", authController.getLogin);

//Post Login page
router.post("/", authController.postLogin);

// Get Registration Page
router.get("/register", authController.getRegister);

// Register New User
router.post("/register", authController.postRegister);

// Logout User
router.get("/logout", authController.getLogOut);

/**
 * Reports Pages
 */

// Get Dashboard Page
router.get("/dashboard", requireAuth, reportsController.getReports);

// Handle Download Requests

router.get("/download/:fileName", reportsController.getDownloads);

// Post add Report
router.post(
  "/add",
  requireAuth,
  reportsController.upload,
  reportsController.postAddReport
);

module.exports = router;
