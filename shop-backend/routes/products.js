const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Product, validate } = require("../models/product");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const e = require("express");

// Get all products
router.get("/", async (req, res) => {
  //check if any parameters are passed in the query
  if (req.query.categoryId) {
    //find products by category
    const products = await Product.find({ categoryId: req.query.categoryId });
    //if no products are found return an error
    if (!products) return res.status(404).send("No products found.");
    return res.send(products);
  } else if (req.query.id) {
    //find product by id
    const product = await Product.findById(req.query.id);
    //if no product is found return an error
    if (!product) return res.status(404).send("No product found.");
    return res.send(product);
  } else if (req.query.search) {
    //find products by search
    const products = await Product.find({
      productName: { $regex: req.query.search, $options: "i" },
    });
    //if no products are found return an error
    if (!products) return res.status(404).send("No products found.");
    return res.send(products);
  } else {
    //if no parameters are passed return all products
    const products = await Product.find();
    //if no products are found return an error
    if (!products) return res.status(404).send("No products found.");
    return res.send(products);
  }
});

// Create a new product
router.post("/", [auth, admin], async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body);

  //if there is an error return the error message
  if (error) return res.status(400).send({ message: error.details[0].message });

  // Create a new product
  const product = new Product({
    productName: req.body.productName,
    numberInStock: req.body.numberInStock,
    unitPrice: req.body.unitPrice,
    categoryId: req.body.categoryId,
  });

  await product.save();

  res.status(201).send(product);
});

// Update a product
router.put("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);

  //if there is an error return the error message
  if (error) return res.status(400).send({ message: error.details[0].message });

  // Update the product
  let product = await Product.findByIdAndUpdate(
    req.query.id,
    {
      $set: {
        productName: req.body.productName,
        numberInStock: req.body.numberInStock,
        unitPrice: req.body.unitPrice,
        categoryId: req.body.categoryId,
      },
    },
    { new: true }
  );

  if (!product)
    return res.status(404).send({ message: "No product found for that ID..." });

  res.status(200).send(product);
});

// Delete a product
router.delete("/", [auth,admin], async (req, res) => {
  // Find the product
  const product = await Product.findByIdAndRemove(req.query.id);


  if (!product) res.status(404).send({
    message: "No product found for that ID..."
  });

  res.status(200).send();
});

module.exports = router;
