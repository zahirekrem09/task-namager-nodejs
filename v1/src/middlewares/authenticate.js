const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  //const token = req.header("x-auth-token");

  const authHeader = await req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token)
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = await JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(httpStatus.FORBIDDEN).json({ message: "Invalid token." });
  }
};

module.exports = authenticate;
