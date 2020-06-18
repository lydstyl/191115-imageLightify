const express = require("express");

const { resize } = require("./askConvertConfirmation.js");

const app = express();

app.use(express.json());

app.post("/resize", (req, res) => {
  const { settings } = req.body;

  settings.width = parseInt(settings.width, 10);
  settings.outputExts = ["jpg", "webp"];

  resize(settings);

  res.json({ msg: "resize finish" });
});

app.listen(4000);
