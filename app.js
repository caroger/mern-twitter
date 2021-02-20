const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const express = require("express");
const app = express();
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

const port = process.env.PORT || 5000;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MangoDB successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello Roger");
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use("/api/users", users);
app.use("/api/tweets", tweets);
