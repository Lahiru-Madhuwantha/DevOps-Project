require("dotenv").config();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  imgURL: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    unique: true,
  },
});

userSchema.methods.getDetails = function () {
  return _.pick(this, [
    "_id",
    "firstName",
    "lastName",
    "email",
    "imgURL",
    "isAdmin",
    "googleId",
  ]);
};

userSchema.methods.setHashPassword = async function () {
  const salt = await bcrypt.genSalt(10);
  const password = this.password;
  this.password = await bcrypt.hash(password, salt);
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50),
    email: Joi.string().min(5).max(255).required().email(),
    imgURL: Joi.string().min(5).max(1024),
    isAdmin: Joi.boolean().default(false),
    password: Joi.string().max(1024),
    googleId: Joi.string().empty(""),
  });

  return schema.validate(user);
}

module.exports = { User, validateUser };
