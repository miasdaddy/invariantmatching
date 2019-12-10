//basic template maching; invariant scale matching not working
const cv = require("opencv4nodejs");

const searchImg = async () => {
  // Load images
  const deviceMat = await cv.imreadAsync("./tests/basic/full.png");
  const iconMat = await cv.imreadAsync("./tests/basic/settings.png");

  // Match template (the brightest locations indicate the highest match)
  const matched = deviceMat.matchTemplate(iconMat, cv.TM_CCOEFF_NORMED);

  // Use minMaxLoc to locate the highest value (or lower, depending of the type of matching method)
  const minMax = matched.minMaxLoc();
  const {
    maxLoc: { x, y }
  } = minMax;

  // Draw bounding rectangle
  deviceMat.drawRectangle(
    new cv.Rect(x, y, iconMat.cols, iconMat.rows),
    new cv.Vec(0, 255, 0),
    2,
    cv.LINE_8
  );

  // Open result in new window
  cv.imshow("Found", deviceMat);
  cv.waitKey();
};

// noinspection JSIgnoredPromiseFromCall
searchImg();
