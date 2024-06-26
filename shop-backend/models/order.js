const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //list of products and their quantities
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        min: 1,
        required: true,
      },
    },
  ],
  createDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  totalCost: {
    type: Number,
    min: 0,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Delivered"],
    default: "Pending",
  },
});

const Order = mongoose.model("Order", orderSchema);

function validateOrder(order) {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.objectId().required(),
        quantity: Joi.number().min(1).required(),
      })
    ),
    totalCost: Joi.number().positive().greater(0),
    status: Joi.string().valid("Pending", "Confirmed", "Delivered"),
  });

  return schema.validate(order);
}

exports.Order = Order;
exports.validate = validateOrder;
