const httpStatus = require("http-status");
const { insert, list } = require("../services/Projects");

/*
get projects
@route GET /api/v1/projects
@access public
*/
const index = (req, res) => {
  list()
    .then((data) => {
      res.status(httpStatus.OK).json({
        message: "Projects listed successfully",
        data,
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Error listing projects",
        err,
      });
    });
};

/*
create project
@route POST /api/v1/projects/create
@access public
*/
const create = (req, res) => {
  const createData = {
    ...req.body,
    user_id: req.user.id,
  };
  insert(createData)
    .then((data) => {
      res.status(httpStatus.CREATED).json({
        message: "Project created successfully",
        data,
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Error creating project",
        err,
      });
    });
};

module.exports = {
  create,
  index,
};
