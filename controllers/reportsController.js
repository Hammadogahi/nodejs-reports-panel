const Report = require("../models/reports");
const multer = require("multer");
const path = require("path");
const {
  getFileName,
  getFilePath,
  formatDate,
} = require("../helpers/reportsHelpers");

// Yet to done
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

//Multer File Upload
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

module.exports.upload = multer({
  storage: storage,
}).single("userReport");
/**
 * User Dashboard Pages
 */

// Get Reports on Dashboard Page based on logged in user

module.exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({
      user: req.userId,
    }).sort({ createdAt: -1 });
    if (reports) {
      res.render("user/dashboard", {
        title: "Dashboard",
        reports,
        getFileName,
        getFilePath,
        formatDate
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Download Links

module.exports.getDownloads = (req, res) => {
  let fileName = req.params.fileName;
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json("Error downloading file");
    }
  });
};

module.exports.getAddReport = (req, res) => {
  res.render("shared/addReport", {
    title: "Add Report",
  });
};

module.exports.postAddReport = async (req, res) => {
  const userReport = req.file && req.file.path;
  const { userComment } = req.body;
  try {
    const report = await Report.create({
      user: req.userId,
      userReport,
      userComment,
    });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

//Get Single Report

module.exports.getSingleReport = async (req, res) => {
  const reportId = req.params.id;
  try {
    const report = await Report.findOne({ _id: reportId });
    if (report) {
      res.render("shared/viewReport", {
        report,
        formatDate,
        getFileName,
        getFilePath,
        formatDate,
        title: "View Report",
      });
    }

    if (!report) {
      res.status(404).json("<h1>No Report Found with this Name</h1>");
    }
  } catch (err) {
    res.status(400).send("<h1>Something Went Wrong</h1>");
  }
};

// Edit Admin Single Report

module.exports.getEditSingleReport = async (req, res) => {
  const reportId = req.params.id;
  try {
    const report = await Report.findOne({ _id: reportId });
    if (!report) {
      throw new Error("No Report Found With this id");
    }
    res.render("admin/editReport", {
      report,
      title: "Edit Report",
      message: req.flash("message"),
      error: null,
    });
  } catch (err) {
    res.render("admin/editReport", {
      report: null,
      title: "Edit Report",
      message: req.flash("message"),
      error: err.message || "No Report Found With this id",
    });
  }
};

module.exports.postEditSingleReport = async (req, res) => {
  const reportId = req.params.id;
  try {
    const adminReport = req.file && req.file.path;
    const adminComment = req.body.userComment;

    if (!adminComment || !adminReport) {
      return res
        .status(400)
        .json({ error: "Comment and Report are required fields." });
    }

    const updatedData = {
      adminComment,
      adminReport,
    };

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });

    const updateRecord = await Report.findOneAndUpdate(
      { _id: reportId },
      updatedData,
      {
        new: true,
      }
    );
    console.log(updateRecord);
    res.status(200).json({ message: "Report updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// User Edit Single Report

module.exports.getUserEditReport = async (req, res) => {
  const reportId = req.params.id;
  try {
    const report = await Report.findOne({ _id: reportId });
    if (!report) {
      throw new Error("No Report Found With this id");
    }
    res.render("user/editReport", {
      report,
      title: "Edit Report",
      message: req.flash("message"),
      error: null,
    });
  } catch (err) {
    res.render("user/editReport", {
      report: null,
      title: "Edit Report",
      message: req.flash("message"),
      error: err.message || "No Report Found With this id",
    });
  }
};

module.exports.postUserEditReport = async (req, res) => {
  const reportId = req.params.id;
  try {
    const userReport = req.file && req.file.path;
    const userComment = req.body.userComment;

    if (!userReport || !userComment) {
      return res
        .status(400)
        .json({ error: "Comment and Report are required fields." });
    }

    const updatedData = {
      userReport,
      userComment,
    };

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });

    const updateRecord = await Report.findOneAndUpdate(
      { _id: reportId },
      updatedData,
      {
        new: true,
      }
    );
    console.log(updateRecord);
    res.status(200).json({ message: "Report updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete Report

module.exports.deleteReport = async (req, res) => {
  const reportId = req.params.id;
  try {
    // Find the report by ID
    const report = await Report.findOne({
      _id: reportId,
    });
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // // Remove the associated file if it exists
    // if (report.userReport) {
    //   const filePath = path.join(__dirname, "..", report.userReport);
    //   fs.unlink(filePath, (err) => {
    //     if (err) console.error(`Failed to delete file: ${filePath}`);
    //   });
    // }

    // Delete the report from the database
    await Report.findOneAndDelete({
      _id: reportId,
    });

    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong. Please Try Again after refreshing!",
    });
  }
};
