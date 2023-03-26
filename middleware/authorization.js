const express = require("express");
const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "bruce", (err, decoded) => {
      if (decoded) {
        next();
      } else {
        res.send("login wrong token");
      }
    });
  } else {
    res.send("login header empty");
  }
};

module.exports = { authorization };
