const settings = {
  inputImagesFolder: '/home/lyd/Images',
  width: 720, // 1080, 1440, 1920, 2160, 2560, 3840
  greyscale: false,
  outputExt: 'auto' // 'webp, jpg, png'
};

exports.settings = settings;

exports.outputExts = ['jpg', 'webp'];

exports.settingsKeys = Object.keys(settings).reverse();

exports.setOutputImagesFolder = () => {
  settings.outputImagesFolder = `${settings.inputImagesFolder}/${
    settings.outputExt
  }_${settings.width}${settings.greyscale ? '_greyscale' : ''}`;
};
