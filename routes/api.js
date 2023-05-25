"use strict";

// Import Models
const IssueModel = require("../models/IssueModel.js");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      // Joins project object width query object
      let objReq = { project, ...req.query };
      IssueModel.find(objReq)
        .then((db) => res.status(200).json(db))
        .catch((e) => res.status(404).json(e));
    })

    .post(function (req, res) {
      let project = req.params.project;

      // Joins project object width body object
      let objReq = { project, ...req.body };

      const newIssue = new IssueModel(objReq);
      newIssue
        .save()
        .then((db) =>
          res.status(201).json({
            assigned_to: db.assigned_to,
            status_text: db.status_text,
            open: db.open,
            _id: db._id,
            issue_title: db.issue_title,
            issue_text: db.issue_text,
            created_by: db.created_by,
            created_on: db.created_on,
            updated_on: db.updated_on,
          })
        )
        .catch((e) =>
          res.status(200).json({ error: "required field(s) missing" })
        );
    })

    .put(function (req, res) {
      let project = req.params.project;

      let obj = { ...req.body };
      let newObj = {};

      if (!obj._id) {
        res.json({ error: "missing _id" });
      } else {
        // Add elements to object with elements from req.body
        Object.keys(obj).map((val) => {
          if (obj[val] !== "" && val !== "_id") newObj[val] = obj[val];
        });
        if (Object.keys(newObj).length === 0) {
          res.json({ error: "no update field(s) sent", _id: req.body._id });
        } else {
          IssueModel.findOneAndUpdate({ _id: req.body._id, project }, newObj)
            .then((db) =>
              res.json({ result: "successfully updated", _id: db._id })
            )
            .catch((e) => {
              res.json({ error: "could not update", _id: obj._id });
            });
        }
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;

      if (!req.body._id) {
        res.json({ error: "missing _id" });
      } else {
        IssueModel.findOneAndRemove({
          project,
          _id: req.body._id,
        })
          .then((db) =>
            res
              .status(202)
              .json({ result: "successfully deleted", _id: db._id })
          )
          .catch((e) =>
            res
              .status(404)
              .json({ error: "could not delete", _id: req.body._id })
          );
      }
    });
};
