const { UserModel } = require("../models/user.model");
const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

userRouter.post("/register", async (req, res) => {
  const { email, password, location, age } = req.body;
  bcrypt.hash(password, 8, async (err, hash) => {
    if (hash) {
      try {
        const user = new UserModel({ email, password: hash, location, age });
        await user.save();
        res.send({ msg: "user is registered" });
      } catch (err) {
        res.send(err);
      }
    } else {
      res.send("Something went wrong, please try again");
    }
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    bcrypt.compare(password, user[0].password, function (err, result) {
      if (result) {
        const token = jwt.sign({ userID: user[0]._id }, "bruce", {
          expiresIn: "1hr",
        });
        res.send({ msg: "Logged in successfully", token: token });
      } else {
        res.send("wrong credentials");
      }
    });
  } catch (err) {
    res.send("no such user exists");
  }
});

module.exports = { userRouter };
