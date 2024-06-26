const Joi = require("joi");
const mongoose = require("mongoose");

const googleUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 50,
    default: null
  },
  googleID: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    unique: true,
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
    maxlength: 2048,
  },
});

const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);

function validateGoogleUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).default(null),
    googleID: Joi.string().min(2).max(100).required(),
    email: Joi.string().min(5).max(255).required().email(),
    imgURL: Joi.string().min(5).max(2048).required(),
  });

  return schema.validate(user);
}

module.exports = { GoogleUser, validateGoogleUser};
