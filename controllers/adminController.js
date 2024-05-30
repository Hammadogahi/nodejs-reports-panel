const User = require("../models/users");
const Report = require("../models/reports");
const { getFileName, getFilePath, formatDate } = require("../helpers/reportsHelpers");

module.exports.getDashboard = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).sort({createdAt: -1});
    // Array to store the latest report for each user
    const latestReports = [];
    if (users) {
      // For each user, find the latest report
      for (const user of users) {
        const latestReport = await Report.aggregate([
          { $match: { user: user._id } }, // Match reports for the current user
          { $sort: { createdAt: -1 } }, // Sort reports by createdAt in descending order
          { $limit: 1 }, // Limit to 1 report (the latest one)
        ]);

        if (latestReport.length > 0) {
          latestReports.push(latestReport[0]); // Push the latest report to the array
        } else {
          latestReports.push({});
        }
      }
    }

    res.render("admin/dashboard", {
      title: "Admin Portal",
      users,
      latestReports,
      getFilePath,
      getFileName,
      formatDate
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getUserReports = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      // Handle case when user is not found
      return res.status(404).send("User not found");
    }
    const reports = await Report.find({ user: user._id }).sort({
      createdAt: -1,
    });
    if (reports) {
      res.render("admin/userReports", {
        user,
        reports,
        getFilePath,
        getFileName,
        formatDate,
        title: "User Reports",
      });
    } else {
      res.status(400).send("Failed to fetch Reports");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    // Find the user by ID
    const user = await User.findOne({
      _id: userId,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user from the database
    await User.findOneAndDelete({
      _id: userId,
    });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong. Please Try Again after refreshing!",
    });
  }
};
