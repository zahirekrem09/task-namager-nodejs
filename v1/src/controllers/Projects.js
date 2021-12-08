const httpStatus = require("http-status");
const { insert, list, modify, remove } = require('../services/Projects');

/*
get projects
@route GET /api/v1/projects
@access public
*/
const index = (req, res) => {
  list()
    .then((data) => {
      res.status(httpStatus.OK).json({
        message: 'Projects listed successfully',
        data
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error listing projects',
        err
      });
    });
};

/*
create project
@route POST /api/v1/projects/create
@access private
*/
const create = (req, res) => {
  const createData = {
    ...req.body,
    user_id: req.user.id
  };
  insert(createData)
    .then((data) => {
      res.status(httpStatus.CREATED).json({
        message: 'Project created successfully',
        data
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating project',
        err
      });
    });
};
/*
update project
@route PUT  /api/v1/projects/update
@access private
@params id
*/
const update = (req, res) => {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Project id is required'
    });
  }
  modify(req.body, req.params.id)
    .then((updateData) => {
      if (!updateData) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Project not found'
        });
      }
      res
        .status(httpStatus.CREATED)
        .json({ message: 'Project updated successfully', data: updateData });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error update project',
        err
      });
    });
};
/*
delete project
@route DELETE /api/v1/projects/delete
@access private
@params id
*/
const destroy = (req, res) => {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Project id is required'
    });
  }
  remove(req.params.id)
    .then((deleteData) => {
      if (!deleteData) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Project not found'
        });
      }
      res.status(httpStatus.OK).json({ message: 'Project delete successfully', data: deleteData });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error update project',
        err
      });
    });
};

module.exports = {
  create,
  index,
  update,
  destroy
};
