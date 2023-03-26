const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { noteRouter } = require("./routes/note.routes");
const { authorization } = require("./middleware/authorization");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use(authorization);
app.use("/note", noteRouter);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Server is connected to DB");
  } catch (err) {
    console.log(err);
  }
  console.log(`Server is running port ${process.env.PORT}`);
});
