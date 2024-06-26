require("dotenv").config();
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.get("/me", auth, (req, res) => {
  //get user from db
  User.findById(req.user._id)
    .then((user) => {
      //send response
      res.send(
        _.pick(user, [
          "_id",
          "firstName",
          "lastName",
          "email",
          "imgURL",
          "isAdmin",
        ])
      );
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//user login
router.post("/login", async (req, res) => {
  //seperate email and password from req.body
  const { email, password } = req.body;

  //check if email and password are provided
  if (!email || !password) {
    return res.status(400).send({ message: "Email and Password are required" });
  }

  //check if user exists
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  }
  //check if password is correct
  const response = await bcrypt.compareSync(password, user.password);
  if (!response) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  }

  //generate token
  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  //send response with token
  res
    .header("Authorization", token)
    .status(200)
    .send(
      _.pick(user, [
        "_id",
        "firstName",
        "lastName",
        "email",
        "imgURL",
        "isAdmin",
      ])
    );
});

router.get("/google/callback", (req, res) => {
  console.log(req.user);
  res.status(200).send("OK");
});

module.exports = router;
