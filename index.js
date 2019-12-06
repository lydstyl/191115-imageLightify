const readline = require('readline');
const { askConvertConfirmation } = require('./askConvertConfirmation.js');
const { settings, settingsKeys } = require('./settings.js');

let max = settingsKeys.length - 1;

function setSettings(settingsKey) {
  if (max >= 0) {
    if (settingsKey !== 'outputImagesFolder') {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question(
        `${settingsKey} = ${settings[settingsKey]} ? 'y' or enter a new value: `,
        answer => {
          if (answer !== 'y') {
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
    askConvertConfirmation();
  }
}

console.log('Default settings: ', settings);

setSettings(settingsKeys[max]);
