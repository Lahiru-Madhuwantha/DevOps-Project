const { Category, validate } = require("../models/category");
const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

router.get("/",[auth], async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

// Create a new category
router.post("/", [auth,admin], async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Create a new category
  let category = new Category({ name: req.body.name });
  category = await category.save();

  res.status(201).send(category);
});

// Update a category
router.put("/:id", [auth,admin], async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Update the category
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.status(200).send(category);
});

// Delete a category
router.delete("/:id", [auth,admin], async (req, res) => {
  // Delete the category
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.status(200).send();
});

// Get a single category by ID
router.get("/:id", [auth,admin], async (req, res) => {
  const category = await Category.findById(req.params.id).select("-__v");

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.status(200).send(category);
});

module.exports = router;
