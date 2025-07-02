const validator = require("validator");

function validateuser(data) {
  const mandatory = ["name", "age", "email", "password"];
  const present = mandatory.every((field) => data.hasOwnProperty(field));
  if (!present) {
    throw new Error("Field is missing");
  }
  if (!validator.isEmail(data.email)) {
    throw new Error("Email is not correct");
  }
  if (!validator.isStrongPassword(data.password)) {
    throw new Error("Password is not strong");
  }
}

module.exports = validateuser;