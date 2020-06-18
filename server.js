const express = require("express");

// const { settings } = require("./settings.js");
const { test } = require("./index.js");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  // modifier les images ici

  test();

  res.json(typeof test);
});

app.listen(3000);
