const fs = require("fs");
const mkdirp = require("mkdirp");
const readline = require("readline");
const sharp = require("sharp");
const sizeOf = require("image-size");

const {
  settings,
  outputExts,
  setOutputImagesFolder,
} = require("./settings.js");

exports.resize = () => {
  makeOutputImagesFolder();

  convertAllImages();
};

function makeOutputImagesFolder() {
  setOutputImagesFolder();

  mkdirp(settings.outputImagesFolder, function (err) {
    // path exists unless there was an error
    if (err) {
      console.log(err);
    }
  });
}

function convertAllImages() {
  fs.readdir(settings.inputImagesFolder, (err, files) => {
    files.forEach((file) => {
      const stats = fs.statSync(`${settings.inputImagesFolder}/${file}`);
      if (stats.isDirectory()) return;

      const inputImage = `${settings.inputImagesFolder}/${file}`;

      const fileName = file.split(".");
      fileName.pop();

      if (settings.outputExt !== "auto") {
        const outputImage = `${settings.outputImagesFolder}/${fileName}.${settings.outputExt}`;
        sharpImage(inputImage, outputImage);
      } else {
        for (let i = 0; i < 2; i++) {
          let outputImage = `${settings.outputImagesFolder}/${fileName}.${outputExts[i]}`;
          sharpImage(inputImage, outputImage);
        }
      }
    });
  });
}

function sharpImage(inputImage, outputImage) {
  sharp(inputImage)
    .greyscale(settings.greyscale)
    .resize(
      sizeOf(inputImage).width < settings.width
        ? sizeOf(inputImage).width
        : settings.width
    )
    .toFile(outputImage, function (err) {
      // containing a scaled and cropped version of input.jpg
      if (err) {
        console.log(err);
      }

      if (settings.outputExt === "auto") {
        const tmp = outputImage.split(".");
        tmp.pop();

        const twinFile1 = tmp.join("") + "." + outputExts[0];
        const twinFile2 = tmp.join("") + "." + outputExts[1];

        if (fs.existsSync(twinFile1) && fs.existsSync(twinFile2)) {
          // remove the bigest file
          if (getFilesizeInBytes(twinFile1) > getFilesizeInBytes(twinFile2)) {
            fs.unlinkSync(twinFile1);
          } else {
            fs.unlinkSync(twinFile2);
          }
        }
      }
    });
}

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats["size"];
  return fileSizeInBytes;
}
