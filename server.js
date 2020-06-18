const express = require("express");
var cors = require("cors");

const { resize } = require("./askConvertConfirmation.js");

const app = express();

app.use(cors()); // fix Access to fetch at 'http://localhost:4000/resize' from origin 'http://localhost:3000' has been blocked by CORS policy
app.use(express.json());

app.post("/resize", (req, res) => {
  const { settings } = req.body;

  settings.width = parseInt(settings.width, 10);
  settings.outputExts = ["jpg", "webp"];

  resize(settings);

  res.json({ msg: "resize finish" });
});

app.listen(4000);
