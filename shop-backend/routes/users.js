require("dotenv").config();
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const users = await User.find().select("-__v").sort("name");
  res.send(users);
});

//create new user
router.post("/", async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ message: "User already registered" });
  user = new User(
    //pick values from lodash as object
    _.pick(req.body, ["firstName", "lastName", "email", "imgURL", "password", "isAdmin"])
  );
  console.log(user);
  await user.setHashPassword();
  console.log("after hashed", user);
  try {
    const response = await user.save();
    console.log("user saved to database ---->", response);

    //generate token
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res
      .header("Authorization", token).status(201)
      .send(_.pick(user, ["_id", "firstName", "lastName", "email", "imgURL"]));
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//update user
router.put("/:id",[auth], async (req, res) => {
  // Validate the request body
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      imgURL: req.body.imgURL,
    },
    { new: true } // {new: true} => By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true,
    // findOneAndUpdate() will instead give you the object after update was applied
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  return res.status(200).send();
});

//delete user
router.delete("/:id", async (req, res) => {
  // Find the user and remove it
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.status(200).send();
});

//get user by id
router.get("/:id", async (req, res) => {
  //get the user
  const user = await User.findById(req.params.id).select("-__v");

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res
    .status(200)
    .send(_.pick(user, ["_id", "firstName", "lastName", "email", "imgURL"]));
});

module.exports = router;
