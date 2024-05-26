const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userReport: { type: String, required: true },
    userComment: { type: String, required: true },
    adminComment: String,
    adminReport: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
