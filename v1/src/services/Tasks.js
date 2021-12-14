const { populate } = require('../models/Task');
const Task = require('../models/Task');
const list = (where) => {
  // list all tasks

  return Task.find(where || {})
    .populate({
      path: 'user_id',
      select: 'full_name email profile_image'
    })
    .populate({
      path: 'assigned_to',
      select: 'full_name email profile_image'
    })
    .populate({
      path: 'project_id',
      select: 'name description'
    })
    .populate({
      path: 'section_id',
      select: 'name'
    });
};

const findById = async (id) => {
  return Task.findById(id)
    .populate({
      path: 'user_id',
      select: 'full_name email profile_image'
    })
    .populate({
      path: 'assigned_to',
      select: 'full_name email profile_image'
    })
    .populate({
      path: 'project_id',
      select: 'name description'
    })
    .populate({
      path: 'section_id',
      select: 'name'
    })
    .populate({
      path: 'sub_tasks',
      populate: {
        path: 'sub_tasks'
      }
      //select: 'title description assigned_to statuses is_completed due_date'
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user_id',
        select: 'full_name email profile_image'
      }
    });
};

const insert = (data) => {
  // db insert Task Model
  const task = new Task(data);

  return task.save();
  // .populate({
  //   path: 'user_id',
  //   select: 'full_name email profile_image'
  // })
  // .populate({
  //   path: 'assigned_to',
  //   select: 'full_name email profile_image'
  // })
  // .populate({
  //   path: 'project_id',
  //   select: 'name description'
  // })
  // .populate({
  //   path: 'section_id',
  //   select: 'name'
  // });
};
const modify = async (data, id) => {
  // db update Task Model
  return Task.findByIdAndUpdate(id, data, { new: true });
};
const remove = async (id) => {
  // db delete Task Model
  return Task.findByIdAndRemove(id);
};

module.exports = {
  insert,
  list,
  modify,
  remove,
  findById
};
