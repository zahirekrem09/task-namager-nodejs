const Section = require('../models/Section');
const list = (where) => {
  // list all sections

  return Section.find(where || {})
    .populate({
      path: 'user_id',
      select: 'full_name email profile_image'
    })
    .populate({
      path: 'project_id',
      select: 'name description'
    });
};

const findById = async (id) => {
  return Section.findById(id)
    .populate({
      path: 'user_id',
      select: 'full_name email profile_image'
    })
    .populate({
      path: 'project_id',
      select: 'name description'
    });
};

const insert = (data) => {
  // db insert Section Model
  const section = new Section(data);
  return section.save();
};
const modify = async (data, id) => {
  // db update Section Model
  return Section.findByIdAndUpdate(id, data, { new: true });
};
const remove = async (id) => {
  // db delete Section Model
  return Section.findByIdAndRemove(id);
};

module.exports = {
  insert,
  list,
  modify,
  remove,
  findById
};
