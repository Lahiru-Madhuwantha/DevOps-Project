const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20
  }
});

const category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(20).required()
  });

  return schema.validate(category);
}

exports.categorySchema = categorySchema;
exports.Category = category; 
exports.validate = validateCategory;