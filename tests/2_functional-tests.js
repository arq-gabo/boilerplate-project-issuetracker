const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let firstTestId;
let secondTestId;

suite("Functional Tests", function () {
  this.timeout(5000);

  // 1
  test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "Title 1 test chai",
        issue_text: "Text 1 test chai",
        created_by: "Create By 1 test chai",
        assigned_to: "Assigned to 1 test chai",
        status_text: "Status text 1 test chai",
      })
      .end(function (err, res) {
        assert.equal(res.status, 201);
        firstTestId = res.body._id;
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "Title 1 test chai");
        assert.equal(res.body.issue_text, "Text 1 test chai");
        assert.equal(res.body.created_by, "Create By 1 test chai");
        assert.equal(res.body.assigned_to, "Assigned to 1 test chai");
        assert.equal(res.body.status_text, "Status text 1 test chai");
        assert.equal(res.body.open, true);
        done();
      });
  });

  // 2
  test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "Title 2 test chai",
        issue_text: "Text 2 test chai",
        created_by: "Create By 2 test chai",
      })
      .end(function (err, res) {
        assert.equal(res.status, 201);
        secondTestId = res.body._id;
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "Title 2 test chai");
        assert.equal(res.body.issue_text, "Text 2 test chai");
        assert.equal(res.body.created_by, "Create By 2 test chai");
        assert.equal(res.body.open, true);
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");
        done();
      });
  });

  // 3
  test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "",
        issue_text: "",
        created_by: "",
        assigned_to: "",
        status_text: "",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

  // 4
  test("View issues on a project: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.isArray(res.body);
        assert.isAtLeast(res.body.length, 2);
        done();
      });
  });

  // 5
  test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_title=Title 1 test chai")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body[0].issue_title, "Title 1 test chai");
        done();
      });
  });

  // 6
  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_title=Title 2 test chai&open=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body[0].issue_title, "Title 2 test chai");
        assert.equal(res.body[0].open, true);
        done();
      });
  });

  // 7
  test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: firstTestId, open: false })
      .end(function (err, res) {
        assert.equal(res.status, 201);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, firstTestId);
        done();
      });
  });

  // 8
  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: secondTestId,
        issue_title: "Update Title 2 test chai",
        open: false,
      })
      .end(function (err, res) {
        assert.equal(res.status, 201);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, secondTestId);
        done();
      });
  });

  // 9
  test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: "", open: false })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });

  // 10
  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: firstTestId })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "no update field(s) sent");
        assert.equal(res.body._id, firstTestId);
        done();
      });
  });

  // 11
  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: "not valid id", open: false })
      .end(function (err, res) {
        assert.equal(res.status, 404);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "could not update");
        assert.equal(res.body._id, "not valid id");
        done();
      });
  });

  // 12 - 1
  test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({ _id: firstTestId })
      .end(function (err, res) {
        assert.equal(res.status, 202);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, firstTestId);
        done();
      });
  });

  // 12 - 2
  test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({ _id: secondTestId })
      .end(function (err, res) {
        assert.equal(res.status, 202);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, secondTestId);
        done();
      });
  });

  // 13
  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({ _id: "not valid id" })
      .end(function (err, res) {
        assert.equal(res.status, 404);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, "not valid id");
        done();
      });
  });

  // 14
  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({ _id: "" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
