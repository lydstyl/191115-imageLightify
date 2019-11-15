const fs = require('fs');
const mkdirp = require('mkdirp');
const sharp = require('sharp');

const settings = {
  inputImagesFolder: '/home/lyd/ddd',
  width: 1080,
  //height: 720,
  outputExt: 'webp'
};
settings.outputImagesFolder = `${settings.inputImagesFolder}/${settings.outputExt} ${settings.width}`;

function makeOutputImagesFolder() {
  mkdirp(settings.outputImagesFolder, function(err) {
    // path exists unless there was an error
    if (err) {
      console.log(err);
    }
  });
}

function convertAllImages() {
  fs.readdir(settings.inputImagesFolder, (err, files) => {
    files.forEach(file => {
      const stats = fs.statSync(`${settings.inputImagesFolder}/${file}`);
      if (stats.isDirectory()) return;

      const fileName = file.split('.');
      fileName.pop();
      const outputImage = `${settings.outputImagesFolder}/${fileName}.${settings.outputExt}`;

      const inputImage = `${settings.inputImagesFolder}/${file}`;

      sharpImage(inputImage, outputImage);
    });
  });
}

function sharpImage(inputImage, outputImage) {
  sharp(inputImage)
    .resize(
      settings.width //,settings.height
    )
    .toFile(outputImage, function(err) {
      // output.jpg is a 300 pixels wide and 200 pixels high image
      // containing a scaled and cropped version of input.jpg
      if (err) {
        console.log(err);
      }
    });
}

const readline = require('readline');

// console.log(settings);

const settingsKeys = Object.keys(settings);
let max = settingsKeys.length - 1;

function setSettings(settingsKey) {
  if (max >= 0) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(
      `${settingsKey} ? default is ${settings[settingsKey]} press 'd' for default or enter a new value: `,
      answer => {
        // TODO: Log the answer in a database
        //console.log(`Your value: ${answer}`);
        if (answer !== 'd') {
          settings[settingsKey] = answer;
        }

        rl.close();
        max--;

        setSettings(settingsKeys[max]);
      }
    );
  } else {
    doStuff();
  }
}

function doStuff() {
  console.log(settings);
  makeOutputImagesFolder();

  convertAllImages();
}

setSettings(settingsKeys[max]);
