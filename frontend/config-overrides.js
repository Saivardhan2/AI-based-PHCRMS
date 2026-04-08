const { override, addWebpackResolve } = require('customize-cra');

module.exports = override(
  addWebpackResolve({
    fallback: {
      "stream": false,
      "assert": false,
      "url": false,
      "http": false,
      "https": false,
      "zlib": false,
      "util": false,
      "buffer": false,
      "process": false
    }
  })
);
