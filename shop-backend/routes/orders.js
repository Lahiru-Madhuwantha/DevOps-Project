const { Order, validate } = require("../models/order");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Get all orders
router.get("/", [auth], async (req, res) => {
  //get the user
  const user = await User.findById(req.user._id);

  //if user is null return an error
  if (!user) return res.status(404).send("User not found.");

  //if user is not admin return specific orders
  if (!user.isAdmin) {
    //check if query parameter is passed
    if (req.query.id) {
      //find order by id
      const order = await Order.findById(req.query.id).select("-__v");
      //if no order is found return an error
      if (!order) return res.status(404).send("No order found.");
      return res.send(order);
    }

    const orders = await Order.find({ "userId": user._id })
      .select("-__v")
      .sort("-dateOut");
    return res.status(200).send(orders);
  } else {
    //if user is admin return all orders
    const orders = await Order.find().select("-__v").sort("-dateOut");
    return res.status(200).send(orders);
  }
});

// Create a new order
router.post("/", [auth], async (req, res) => {
  console.log(req.body);

  // Validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user exists
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("Invalid user.");

  // Check if the products exist and have enough stock
  for (let i = 0; i < req.body.products.length; i++) {
    let product = await Product.findById(req.body.products[i].productId);
    if (!product) return res.status(400).send("Invalid product.");

    if (product.numberInStock < req.body.products[i].quantity)
      return res.status(400).send("Not enough stock.");
  }

  // Create the order
  let order = new Order({
    userId: user._id,
    products: req.body.products,
    totalCost: req.body.totalCost,
  });

  // Save the order
  order = await order.save();

  // Update the product stock
  for (let i = 0; i < req.body.products.length; i++) {
    let product = await Product.findById(req.body.products[i].productId);
    product.numberInStock -= req.body.products[i].quantity;
    await product.save();
  }

  res.status(201).send();
});

module.exports = router;
