const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  // modifier les images ici

  res.json({ msg: "coucou" });
});

app.listen(3000);
