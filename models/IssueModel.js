const mongoose = require("mongoose");

let IssueSchema = mongoose.Schema(
  {
    assigned_to: {
      type: String,
      default: "",
    },
    status_text: {
      type: String,
      default: "",
    },
    open: {
      type: Boolean,
      default: true,
    },
    issue_title: {
      type: String,
      required: true,
    },
    issue_text: {
      type: String,
      required: true,
    },
    created_by: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      select: false,
      required: true,
    },
    __v: { type: Number, select: false },
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "updated_on",
    },
  }
);

module.exports = mongoose.model("Issue", IssueSchema);
