const httpStatus = require("http-status");
const uuid = require('uuid');
const { insert, list, loginUser, modify, remove } = require('../services/Users');
const projectService = require('../services/Projects');
const {
  passwordHash,
  generareAccessToken,
  generareRefreshToken
} = require('../scripts/utils/helper');
const User = require('../models/User');
const eventEmitter = require('../scripts/events/eventEmitter');
const path = require('path');

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

      res.status(httpStatus.OK).json({
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
delete user
@route DELETE /api/v1/users/delete:id
@access private
@params id
*/
const destroy = (req, res) => {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'User id is required'
    });
  }
  remove(req.params.id)
    .then((deleteData) => {
      if (!deleteData) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'User not found'
        });
      }
      res.status(httpStatus.OK).json({ message: 'User delete successfully', data: deleteData });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error update project',
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
/*
change password user
@route post /api/v1/users/change-password
@access private
*/
const changePassword = (req, res) => {
  // TODO: check old password and change new password
  req.body.password = passwordHash(req.body.password);
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
update profile image  user(req.files)
@route post /api/v1/users/update-profile-image
@access private
*/
const updateProfileImage = (req, res) => {
  //TODO:  use coludunary storage
  //TODO:  delete old image https://www.codegrepper.com/code-examples/javascript/delete+image+from+folder+node+js
  if (!req.files?.profile_image) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Profile Image is required'
    });
  }
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedMimeTypes.includes(req.files.profile_image.mimetype)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Profile Image is not valid just jpeg,png,gif'
    });
  }
  const extenssion = path.extname(req.files.profile_image.name);
  const fileName = `${req.user.id}_${new Date().getTime()}${extenssion}`;
  const folderPath = path.join(__dirname, '../', 'uploads/users', fileName);
  req.files.profile_image.mv(folderPath, (err) => {
    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error profile image upload',
        err
      });
    }

    modify({ _id: req.user.id }, { profile_image: fileName })
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
  });
};
module.exports = {
  create,
  index,
  login,
  update,
  destroy,
  projectList,
  resetPassword,
  changePassword,
  updateProfileImage
};
