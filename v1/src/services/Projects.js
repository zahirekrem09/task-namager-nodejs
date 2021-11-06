const Project = require("../models/Project");
const list = (data) => {
  // list all projects
  return Project.find({});
};

const insert = (data) => {
  // db insert Project Model
  const project = new Project(data);
  return project.save();
};

module.exports = {
  insert,
  list,
};
