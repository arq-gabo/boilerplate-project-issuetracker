"use strict";

// Import Models
const IssueModel = require("../models/IssueModel.js");

// Import return object in POST and PUT
const returnObj = require("../middleware/returnObj.js");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      // Joins project object width query object
      let objReq = { project, ...req.query };
      IssueModel.find(objReq)
        .select("-__v")
        .select("-project")
        .then((db) => res.json(db))
        .catch((e) => res.send(e));
    })

    .post(function (req, res) {
      let project = req.params.project;

      // Joins project object width body object
      let objReq = { project, ...req.body };

      const newIssue = new IssueModel(objReq);

      newIssue
        .save()
        .then((db) => res.json(returnObj.funcRntObj(db)))
        .catch((e) => res.json({ error: "required field(s) missing" }));
    })

    .put(function (req, res) {
      let project = req.params.project;

      // Add elements to object with elements from re.body
      let obj = req.body;
      let newObj = {};
      Object.keys(obj).map((val) => {
        if (obj[val] !== "" && val !== "_id") newObj[val] = obj[val];
      });
      IssueModel.findOneAndUpdate(
        {
          project,
          _id: req.body._id,
        },
        newObj
      )
        .then((db) => res.json({ result: "successfully updated", _id: db._id }))
        .catch((e) =>
          res.json({ error: "could not update", _id: req.body._id })
        );
    })

    .delete(function (req, res) {
      let project = req.params.project;
      IssueModel.findOneAndRemove({
        project,
        _id: req.body._id,
      })
        .then((db) => res.json({ result: "successfully deleted", _id: db._id }))
        .catch((e) =>
          res.json({ error: "could not delete", _id: req.body._id })
        );
    });
};
