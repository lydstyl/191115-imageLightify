const express = require("express");

const { resize } = require("./askConvertConfirmation.js");

const app = express();

app.use(express.json());

app.post("/resize", (req, res) => {
  const width = parseInt(req.body.width, 10);
  console.log("width", width);

  settings = {
    width, // width: 1200, // 1080, 1366, 1440, 1920, 2160, 2560, 3840

    inputImagesFolder: "/home/gab/imagesFolder",
    greyscale: false,
    outputExt: "jpg", // 'auto, webp, jpg, png'
  };

  resize(settings);

  res.json({ msg: "resize finish" });
});

app.listen(3000);
