// 1. What it does: perform image search for given images using FLANN-based matcher
// 2. Input images: path is stored in INPUT_IMAGES constant.
//      Image file names start with 'obj': the object needs to be searched
//      Image file names start with 'screen': screenshot of mobile devices
// 3. Output images: under OUTPUT_FOLDER

const cv = require("opencv4nodejs");
const fs = require("fs");

const INPUT_FOLDER = "./tests/3";
const OUTPUT_FOLDER = "./results";

//build the list of objects and the list of screens
let objects = [];
let screens = [];
fs.readdirSync(INPUT_FOLDER).forEach(file => {
  if (file.includes(".")) {
    if (file.includes("obj-")) {
      objects.push(file);
    } else {
      screens.push(file);
    }
  }
});

// match
const resultFolder = Number(new Date()).toString();

for (const obj of objects) {
  let img2 = cv.imread(`${INPUT_FOLDER}/${obj}`);
  for (const screen of screens) {
    let img1 = cv.imread(`${INPUT_FOLDER}/${screen}`);

    // compute feature descriptors
    const detector = new cv.SIFTDetector({ nFeatures: 2000 });
    const keyPoints1 = detector.detect(img1);
    const keyPoints2 = detector.detect(img2);
    const descriptors1 = detector.compute(img1, keyPoints1);
    const descriptors2 = detector.compute(img2, keyPoints2);

    // match the feature descriptors
    const matches = cv.matchFlannBased(descriptors1, descriptors2);

    //sort and get top 3 matches
    const bestMatches = matches
      .sort((match1, match2) => match1.distance - match2.distance)
      .slice(0, 1);

    console.log(obj, "+", screen, bestMatches);

    // create match image
    const resultImg = cv.drawMatches(
      img1,
      img2,
      keyPoints1,
      keyPoints2,
      bestMatches
    );

    //output
    if (!fs.existsSync(`${OUTPUT_FOLDER}/${resultFolder}`)) {
      fs.mkdirSync(`${OUTPUT_FOLDER}/${resultFolder}`);
    }

    const fileName = `${OUTPUT_FOLDER}/${resultFolder}/${obj
      .toString()
      .substring(0, obj.length - 4)}-${screen}`;

    cv.imwrite(fileName, resultImg);
  }
}
