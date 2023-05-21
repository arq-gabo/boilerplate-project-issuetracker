const funcRntObj = (obj) => {
  let rtnObj = {
    assigned_to: obj.assigned_to,
    status_text: obj.status_text,
    open: obj.open,
    _id: obj._id,
    issue_title: obj.issue_title,
    issue_text: obj.issue_text,
    created_by: obj.created_by,
    created_on: obj.created_on,
    updated_on: obj.updated_on,
  };

  return rtnObj;
};

module.exports = { funcRntObj };
