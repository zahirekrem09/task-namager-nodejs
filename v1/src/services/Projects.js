const Project = require("../models/Project");
const list = (where) => {
  // list all projects
  return Project.find(where || {}).populate({
    path: 'user_id',
    select: 'full_name email'
  });
};

const insert = (data) => {
  // db insert Project Model
  const project = new Project(data);
  return project.save();
};
const modify = async (data, id) => {
  // db update Project Model
  return Project.findByIdAndUpdate(id, data, { new: true });
};
const remove = async (id) => {
  // db update Project Model
  return Project.findByIdAndRemove(id);
};

module.exports = {
  insert,
  list,
  modify,
  remove
};
