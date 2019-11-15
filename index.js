const fs = require('fs');
const mkdirp = require('mkdirp');
const sharp = require('sharp');

function setOutputImagesFolder() {
  settings.outputImagesFolder = `${settings.inputImagesFolder}/${
    settings.outputExt
  }_${settings.width}_${settings.greyscale ? 'greyscale' : ''}`;
}

const settings = {
  inputImagesFolder: '/home/lyd/Images',
  width: 1080, // 1440, 2560
  //height: 720,
  greyscale: false,
  outputExt: 'auto' // 'webp'
};
setOutputImagesFolder();

const outputExts = ['jpg', 'webp'];

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

      const inputImage = `${settings.inputImagesFolder}/${file}`;

      const fileName = file.split('.');
      fileName.pop();

      if (settings.outputExt !== 'auto') {
        const outputImage = `${settings.outputImagesFolder}/${fileName}.${settings.outputExt}`;
        sharpImage(inputImage, outputImage);
      } else {
        const sizes = [0, 0];

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
      settings.width //,settings.height
    )
    .toFile(outputImage, function(err) {
      // containing a scaled and cropped version of input.jpg
      if (err) {
        console.log(err);
      }

      if (settings.outputExt === 'auto') {
        // remove bigger file if exists

        const tmp = outputImage.split('.');
        tmp.pop();

        const twinFile1 = tmp.join('') + '.' + outputExts[0];
        const twinFile2 = tmp.join('') + '.' + outputExts[1];

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
  var fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
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
          if (answer === 'd') {
            // set outputImagesFolder if we have a new outputExt
            if (settingsKey === 'outputExt') {
              setOutputImagesFolder();
            }
          } else {
            // set width to a number
            if (settingsKey === 'width') {
              answer = parseInt(answer, 10);
            }

            // set greyscale to a boolean
            if (settingsKey === 'greyscale') {
              if (answer === 'true' || answer === true) {
                answer = true;
              } else {
                answer = false;
              }
            }

            settings[settingsKey] = answer;
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
