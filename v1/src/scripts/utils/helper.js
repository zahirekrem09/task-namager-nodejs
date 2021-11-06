const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");

const passwordHash = (password) => {
  return CryptoJS.HmacSHA256(
    password,
    CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH).toString()
  ).toString();
};

const generareAccessToken = (user) => {
  return JWT.sign(
    {
      id: user.id,
      email: user.email,
      name: user.full_name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
};
const generareRefreshToken = (user) => {
  return JWT.sign(
    {
      id: user.id,
      email: user.email,
      name: user.full_name,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  passwordHash,
  generareAccessToken,
  generareRefreshToken,
};
