const settings = {
  inputImagesFolder: "/home/gab/imagesFolder",
  width: 1200, // 1080, 1366, 1440, 1920, 2160, 2560, 3840
  greyscale: false,
  outputExt: "jpg", // 'auto, webp, jpg, png'
};

exports.settings = settings;

exports.outputExts = ["jpg", "webp"];

exports.settingsKeys = Object.keys(settings).reverse();

exports.setOutputImagesFolder = () => {
  settings.outputImagesFolder = `${settings.inputImagesFolder}/${
    settings.outputExt
  }_${settings.width}${settings.greyscale ? "_greyscale" : ""}`;
};
