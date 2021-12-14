const httpStatus = require('http-status');
const { insert, list, modify, remove, findById } = require('../services/Tasks');
//TODO: get one tasks controllers
/*
get tasks
@route GET /api/v1/tasks
@access private
*/
const index = (req, res) => {
  const section_id = req.params.sectiontId;
  if (!section_id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Section id is required'
    });
  }
  list({ section_id })
    .then((data) => {
      res.status(httpStatus.OK).json({
        message: 'Tasks listed successfully',
        data
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error listing tasks',
        err
      });
    });
};
/*
get task
@route GET /api/v1/tasks
@access public
@params id
*/
const detail = (req, res) => {
  const task_id = req.params.id;
  if (!task_id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Task id is required'
    });
  }
  findById(task_id)
    .then((data) => {
      if (!data) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Task not found'
        });
      }
      res.status(httpStatus.OK).json({
        message: 'Task detail successfully',
        data
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error task detail',
        err
      });
    });
};
/*
create task
@route POST /api/v1/tasks/create
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
        message: 'Task created successfully',
        data
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating Task',
        err
      });
    });
};
/*
update task
@route PUT  /api/v1/tasks/update
@access private
@params id
*/
const update = (req, res) => {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Task id is required'
    });
  }
  modify(req.body, req.params.id)
    .then((updateData) => {
      if (!updateData) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Task not found'
        });
      }
      res.status(httpStatus.OK).json({ message: 'Task updated successfully', data: updateData });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error update Task',
        err
      });
    });
};
/*
delete task
@route DELETE /api/v1/tasks/delete
@access private
@params id
*/
const destroy = (req, res) => {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Task id is required'
    });
  }
  remove(req.params.id)
    .then((deleteData) => {
      if (!deleteData) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Task not found'
        });
      }
      res.status(httpStatus.OK).json({ message: 'Task delete successfully', data: deleteData });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error delete Task',
        err
      });
    });
};

/*
make comment to task
@route PUT /api/v1/tasks/make-comment
@access private
@params id
*/
const makeComment = (req, res) => {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Task id is required'
    });
  }

  findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Task not found'
        });
      }
      const comment = {
        ...req.body,
        user_id: req.user.id,
        commented_at: new Date()
      };
      data.comments.push(comment);
      data.save().then((updateData) => {
        return res
          .status(httpStatus.OK)
          .json({ message: 'Task updated successfully', data: updateData });
      });
    })

    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error make comment  Task',
        err
      });
    });
};
/*
delete comment to task
@route PUT /api/v1/tasks/delete-comment
@access private
@params id
*/
const deleteComment = (req, res) => {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Task id is required'
    });
  }

  findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Task not found'
        });
      }

      data.comments = data.comments.filter((item) => item.id !== req.body.id);
      data.save().then((updateData) => {
        return res
          .status(httpStatus.OK)
          .json({ message: 'Task updated successfully', data: updateData });
      });
    })

    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error delete comment  Task',
        err
      });
    });
};
/*
add subtasks to task
@route POST /api/v1/tasks/add-sub-tasks
@access private
@params id
*/
const addSubTask = (req, res) => {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Task id is required'
    });
  }
  findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Task not found'
        });
      }
      const subTask = {
        ...req.body,
        user_id: req.user.id,
        project_id: data.project_id,
        section_id: data.section_id
      };
      insert(subTask)
        .then((t) => {
          data.sub_tasks.push(t._id);
          data.save().then((updateData) => {
            return res
              .status(httpStatus.OK)
              .json({ message: 'Task updated successfully', data: updateData });
          });
        })
        .catch((err) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error create subtask',
            err
          });
        });
    })

    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error add sub task  Task',
        err
      });
    });
};
module.exports = {
  create,
  index,
  update,
  destroy,
  detail,
  makeComment,
  deleteComment,
  addSubTask
};
