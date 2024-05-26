const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const reportsController = require("../controllers/reportsController");
const { checkAdmin } = require("../middleware/authMiddleware");

// Route to render admin dashboard
router.get("/dashboard", checkAdmin, adminController.getDashboard);

// Handle requests to /admin/user without an ID
router.get("/user", (req, res) => {
  // Redirect to admin dashboard or display error message
  res.redirect("/admin/dashboard");
});

router.get("/user/:id", checkAdmin, adminController.getUserReports);

router.get("/report/:id", checkAdmin, reportsController.getSingleReport);
router.get(
  "/report/edit/:id",
  checkAdmin,
  reportsController.getEditSingleReport
);
router.post(
  "/report/edit/:id",
  checkAdmin,
  reportsController.upload,
  reportsController.postEditSingleReport
);

router.delete("/user/delete/:id", checkAdmin, adminController.deleteUser);

module.exports = router;
