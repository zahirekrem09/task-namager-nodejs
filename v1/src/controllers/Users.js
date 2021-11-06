const httpStatus = require("http-status");
const { insert, list, loginUser } = require("../services/Users");
const {
  passwordHash,
  generareAccessToken,
  generareRefreshToken,
} = require("../scripts/utils/helper");
const User = require("../models/User");

/*
get users
@route GET /api/v1/users
@access public
*/
const index = (req, res) => {
  list()
    .then((data) => {
      res.status(httpStatus.OK).json({
        message: "Users listed successfully",
        data,
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Error listing users",
        err,
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
      message: "User already exists",
    });
  }
  const cryptedPassword = passwordHash(req.body.password);
  const userData = {
    ...req.body,
    password: cryptedPassword,
  };

  insert(userData) // insert user
    .then((data) => {
      res.status(httpStatus.CREATED).json({
        message: "User created successfully",
        data,
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Error creating user",
        err,
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
    password: cryptedPassword,
  };
  loginUser(userData)
    .then((user) => {
      if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: "Invalid credentials",
          //   data: null,
        });
      }

      const userData = {
        ...user._doc, // or user.toObject()
        tokens: {
          accessToken: generareAccessToken(user),
          refreshToken: generareRefreshToken(user),
        },
      };

      delete userData.password;

      res.status(httpStatus.CREATED).json({
        message: "User login successfully",
        data: userData,
      });
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Error login user",
        err,
      });
    });
};

module.exports = {
  create,
  index,
  login,
};
