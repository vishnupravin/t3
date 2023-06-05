const path = require('path');
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assests/fonts/'],
  dependency: {
    platforms: {
      ios: {
        project: './platforms/ios/SQLite.xcodeproj',
      },
      android: {
        sourceDir: './platforms/android',
      },
    },
  },
};
