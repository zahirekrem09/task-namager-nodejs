const httpStatus = require('http-status');
const { insert, list, modify, remove, findById } = require('../services/Sections');
//TODO: get one section controllers
/*
get sections
@route GET /api/v1/sections
@access public
*/
const index = (req, res) => {
  const project_id = req.params.projectId;
  if (!project_id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Project id is required'
    });
  }
  list({ project_id })
    .then((data) => {
      res.status(httpStatus.OK).json({
        message: 'Sections listed successfully',
        data
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error listing sections',
        err
      });
    });
};
/*
get section
@route GET /api/v1/sections
@access public
*/
const detail = (req, res) => {
  const section_id = req.params.sectionId;
  if (!section_id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Section id is required'
    });
  }
  findById(section_id)
    .then((data) => {
      res.status(httpStatus.OK).json({
        message: 'Section detail successfully',
        data
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error section detail',
        err
      });
    });
};
/*
create section
@route POST /api/v1/sections/create
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
        message: 'Section created successfully',
        data
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating Section',
        err
      });
    });
};
/*
update section
@route PUT  /api/v1/sections/update
@access private
@params id
*/
const update = (req, res) => {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Section id is required'
    });
  }
  modify(req.body, req.params.id)
    .then((updateData) => {
      if (!updateData) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Section not found'
        });
      }
      res.status(httpStatus.OK).json({ message: 'Section updated successfully', data: updateData });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error update Section',
        err
      });
    });
};
/*
delete section
@route DELETE /api/v1/sections/delete
@access private
@params id
*/
const destroy = (req, res) => {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Section id is required'
    });
  }
  remove(req.params.id)
    .then((deleteData) => {
      if (!deleteData) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Section not found'
        });
      }
      res.status(httpStatus.OK).json({ message: 'Section delete successfully', data: deleteData });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error delete Section',
        err
      });
    });
};

module.exports = {
  create,
  index,
  update,
  destroy,
  detail
};
