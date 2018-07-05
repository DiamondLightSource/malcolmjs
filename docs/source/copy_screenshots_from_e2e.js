const smgScreenshotFolder = '../../cypress/screenshots/integration/smg_screenshots.js';
const userGuideScreenshotFolder = '../../cypress/screenshots/integration/user_guide_screenshots.js';
const fs = require('fs');

fs.readdirSync(smgScreenshotFolder).forEach(file => {
  console.log(file);
  fs.copyFileSync(__dirname + '/' + smgScreenshotFolder + '/' + file, __dirname + '/SMG/screenshots/' + file);
})

fs.readdirSync(userGuideScreenshotFolder).forEach(file => {
  console.log(file);
  fs.copyFileSync(__dirname + '/' + userGuideScreenshotFolder + '/' + file, __dirname + '/userguide/screenshots/' + file);
})