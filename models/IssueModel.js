const mongoose = require("mongoose");

let IssueSchema = mongoose.Schema(
  {
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
    assigned_to: {
      type: String,
    },
    status_text: {
      type: String,
    },
    open: {
      type: Boolean,
      default: true,
    },
    project: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "updated_on",
    },
  }
);

module.exports = mongoose.model("Issue", IssueSchema);
