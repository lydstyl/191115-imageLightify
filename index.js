const readline = require("readline");
const { askConvertConfirmation } = require("./askConvertConfirmation.js");
const { settings, settingsKeys } = require("./settings.js");

function setSettings(settingsKey, max) {
  if (max >= 0) {
    if (settingsKey !== "outputImagesFolder") {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question(
        `${settingsKey} = ${settings[settingsKey]} ? press enter or write the new value: `,
        (answer) => {
          if (answer !== "") {
            // set width to a number
            if (settingsKey === "width") {
              answer = parseInt(answer, 10);
            }

            // set greyscale to a boolean
            if (settingsKey === "greyscale") {
              if (answer === "true" || answer === true) {
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

function resize(settings) {
  console.log("Default settings: ", settings);

  let max = settingsKeys.length - 1;

  setSettings(settingsKeys[max], max);
}

exports.resize = resize;
