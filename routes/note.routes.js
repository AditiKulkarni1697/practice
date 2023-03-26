const express = require("express");
const noteRouter = express.Router();
const { NoteModel } = require("../models/note.model");
const jwt = require("jsonwebtoken");

noteRouter.get("/", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "bruce");
  //console.log(decoded);
  try {
    const notes = await NoteModel.find({ userID: decoded.userID });
    res.send(notes);
  } catch (err) {
    res.send("please log in note get");
  }
});

noteRouter.post("/post", async (req, res) => {
  const token = req.headers.authorization;

  const payload = req.body;
  try {
    const decoded = jwt.verify(token, "bruce");
    if (decoded) {
      payload.userID = decoded.userID;
      const note = new NoteModel(payload);
      await note.save();
      res.send("note is created");
    } else {
      res.send("please login note post");
    }
  } catch (err) {
    res.send(err);
  }
});

noteRouter.patch("/patch/:id", async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization;
  const payload = req.body;
  const decoded = jwt.verify(token, "bruce");
  if (decoded) {
    const note = await NoteModel.find({ _id: id });
    if (note[0].userID == decoded.userID) {
      try {
        await NoteModel.findByIdAndUpdate({ _id: id }, payload);
        res.send("note updated");
      } catch (err) {
        res.send(err);
      }
    }
  } else {
    res.send("please login patch ");
  }
});

noteRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization;

  const decoded = jwt.verify(token, "bruce");

  if (decoded) {
    const note = await NoteModel.find({ _id: id });
    if (decoded.userID == note[0].userID) {
      try {
        await NoteModel.findByIdAndDelete({ _id: id });
        res.send("note deleted");
      } catch (err) {
        res.send(err);
      }
    } else {
      res.send("please login wrong user");
    }
  } else {
    res.send("please login delete route");
  }
});

module.exports = { noteRouter };
