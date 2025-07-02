const jwt = require("jsonwebtoken");
const user = require("./user");

const authuser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new Error("token doesn't exists");
  }
  const payload = jwt.verify(token, "aaa");
  const { _id } = payload;
  if (!_id) {
    throw new Error("Id is missing");
  }
  const result = await user.findById(_id);
  if (!result) {
    throw new Error("user doesn't exists");
  }
  req.result = result;
  next();
};
module.exports = authuser;
