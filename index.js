const fs = require('fs');
const mkdirp = require('mkdirp');
const sharp = require('sharp');

const settings = {
  inputImagesFolder: '/home/lyd/Images',
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
      // containing a scaled and cropped version of input.jpg
      if (err) {
        console.log(err);
      }
    });
}

const readline = require('readline');

const settingsKeys = Object.keys(settings).reverse();
let max = settingsKeys.length - 1;

function setSettings(settingsKey) {
  if (max >= 0) {
    if (settingsKey !== 'outputImagesFolder') {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question(
        `${settingsKey} ? default is ${settings[settingsKey]} press 'd' for default or enter a new value: `,
        answer => {
          if (answer !== 'd') {
            settings[settingsKey] = answer;
          }
          if (settingsKey === 'outputExt') {
            settings.outputImagesFolder = `${settings.inputImagesFolder}/${settings.outputExt} ${settings.width}`;
          }

          rl.close();
          max--;

          setSettings(settingsKeys[max]);
        }
      );
    } else {
      max--;

      setSettings(settingsKeys[max]);
    }
  } else {
    doStuff();
  }
}

function doStuff() {
  console.log(settings);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(`Ok ? y/n `, answer => {
    if (answer === 'y') {
      makeOutputImagesFolder();

      convertAllImages();
    }

    rl.close();
  });
}

setSettings(settingsKeys[max]);
