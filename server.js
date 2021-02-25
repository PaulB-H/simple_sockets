const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Set static folder for front-end
app.use(express.static("./view"));

const server = app.listen(port, () => {
  console.log(`Listening on port: ${port} \n`);
});

// Serves our front end
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/index.html"));
});
