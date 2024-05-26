const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const reportsController = require("../controllers/reportsController");
const {
  requireAuth,
  checkUser,
  checkAdmin,
} = require("../middleware/authMiddleware");

router.get("/dashboard", requireAuth, reportsController.getReports);
router.get("/add", requireAuth, reportsController.getAddReport);
router.get("/report/:id", requireAuth, reportsController.getSingleReport);
router.get(
  "/report/edit/:id",
  requireAuth,
  reportsController.getUserEditReport
);
router.post(
  "/report/edit/:id",
  requireAuth,
  reportsController.upload,
  reportsController.postUserEditReport
);

router.delete(
  "/report/delete/:id",
  requireAuth,
  reportsController.deleteReport
);

module.exports = router;
