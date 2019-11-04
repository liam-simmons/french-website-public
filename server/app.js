require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

mongoose.connect(
  process.env.MONGO_DB_CONNECTION_LINK ||
    "mongodb://localhost/APIAuthentication"
);
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());

//routes
app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/api/images", require("./routes/images"));
app.use("/api/users", require("./routes/users"));
app.use("/api/words", require("./routes/words"));
//app.use("/api/forums", require("./routes/forums"));
app.use("/api/word-categories", require("./routes/wordCategories"));

//any others go to react
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "../client/build/index.html"));
});
//start server
const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on port ${port}`);
