const httpStatus = require("http-status");
const uuid = require('uuid');
const { insert, list, loginUser, modify } = require('../services/Users');
const projectService = require('../services/Projects');
const {
  passwordHash,
  generareAccessToken,
  generareRefreshToken
} = require('../scripts/utils/helper');
const User = require('../models/User');
const { data } = require('../scripts/logger/Projects');
const eventEmitter = require('../scripts/events/eventEmitter');

/*
get users
@route GET /api/v1/users
@access public
*/
const index = (req, res) => {
  list()
    .then((data) => {
      res.status(httpStatus.OK).json({
        message: 'Users listed successfully',
        data
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error listing users',
        err
      });
    });
};

/*
create user
@route POST /api/v1/users/create
@access public
*/
const create = async (req, res) => {
  // check user exist
  const checkUser = await User.findOne({ email: req.body.email });
  if (checkUser) {
    return res.status(httpStatus.CONFLICT).json({
      message: 'User already exists'
    });
  }
  const cryptedPassword = passwordHash(req.body.password);
  const userData = {
    ...req.body,
    password: cryptedPassword
  };

  insert(userData) // insert user
    .then((data) => {
      res.status(httpStatus.CREATED).json({
        message: 'User created successfully',
        data
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating user',
        err
      });
    });
};
/*
create user
@route POST /api/v1/users/login
@access public
*/
const login = (req, res) => {
  const cryptedPassword = passwordHash(req.body.password);
  const userData = {
    ...req.body,
    password: cryptedPassword
  };
  loginUser(userData)
    .then((user) => {
      if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: 'Invalid credentials'
          //   data: null,
        });
      }

      const userData = {
        ...user._doc, // or user.toObject()
        tokens: {
          accessToken: generareAccessToken(user),
          refreshToken: generareRefreshToken(user)
        }
      };

      delete userData.password;

      res.status(httpStatus.CREATED).json({
        message: 'User login successfully',
        data: userData
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error login user',
        err
      });
    });
};
/*
update user
@route PATCH /api/v1/users/update
@access private
*/
const update = (req, res) => {
  modify({ _id: req.user.id }, req.body)
    .then((updateData) => {
      if (!updateData) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'User not found'
        });
      }
      res.status(httpStatus.OK).json({ message: 'User updated successfully', data: updateData });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error update user',
        err
      });
    });
};

/*
list user projects
@route GET /api/v1/users/projects
@access private
*/
const projectList = (req, res) => {
  projectService
    .list({ user_id: req.user.id })
    .then((data) => {
      res.status(httpStatus.OK).json({
        message: 'Projects listed successfully',
        data
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error user projects list',
        err
      });
    });
};
/*
reset user password
@route POST /api/v1/users/reset-password
@access public
*/
const resetPassword = (req, res) => {
  //TODO: send mail link  to user  than change and reset password

  const newPassword = uuid.v4()?.split('-')[0] || `usr-${new Date().getTime()}`;
  modify({ email: req.body.email }, { password: passwordHash(newPassword) })
    .then((user) => {
      if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'User not found'
        });
      }
      // !! send email events
      eventEmitter.emit('send_mail', {
        to: user.email,
        subject: 'Reset Password ✔', // Subject line
        html: `<b>Your Password : ${newPassword}</b>` // html body
      });
      res.status(httpStatus.OK).json({
        message: 'Password reset successfully and sent to your email',
        data: user
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error reset password',
        err
      });
    });
};
module.exports = {
  create,
  index,
  login,
  update,
  projectList,
  resetPassword
};
