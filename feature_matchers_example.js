const cv = require("opencv4nodejs");

const matchFeatures = ({ img1, img2, detector, matchFunc }) => {
  // detect keypoints
  const keyPoints1 = detector.detect(img1);
  const keyPoints2 = detector.detect(img2);

  // compute feature descriptors
  const descriptors1 = detector.compute(img1, keyPoints1);
  const descriptors2 = detector.compute(img2, keyPoints2);

  // match the feature descriptors
  const matches = matchFunc(descriptors1, descriptors2);

  // get the best match whose distance is smallest
  const bestN = 3;
  const bestMatches = matches
    .sort((match1, match2) => match1.distance - match2.distance)
    .slice(0, bestN);

  return cv.drawMatches(img1, img2, keyPoints1, keyPoints2, bestMatches);
};

let img1 = cv.imread("./full.png");
const img2 = cv.imread("./settings.png");

let siftMatchesImg = matchFeatures({
  img1,
  img2,
  detector: new cv.SIFTDetector({ nFeatures: 2000 }),
  matchFunc: cv.matchFlannBased
});

cv.imshowWait("SIFT matches", siftMatchesImg);

const orbMatchesImg = matchFeatures({
  img1,
  img2,
  detector: new cv.ORBDetector(),
  matchFunc: cv.matchBruteForceHamming
});
cv.imshowWait("ORB matches", orbMatchesImg);

// Match using the BFMatcher with crossCheck true
const bf = new cv.BFMatcher(cv.NORM_L2, true);
const orbBFMatchIMG = matchFeatures({
  img1,
  img2,
  detector: new cv.ORBDetector(),
  matchFunc: (desc1, desc2) => bf.match(desc1, desc2)
});
cv.imshowWait("ORB with BFMatcher - crossCheck true", orbBFMatchIMG);
