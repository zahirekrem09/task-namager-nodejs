const User = require("../models/User");
const list = () => {
  // list all users
  return User.find({});
};

const insert = (data) => {
  // db insert User Model
  const user = new User(data);
  return user.save();
};
const loginUser = (data) => {
  // db check User Model
  return User.findOne({ email: data.email, password: data.password });
};

module.exports = {
  insert,
  list,
  loginUser,
};
