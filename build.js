const stealTools = require('steal-tools');
const path = require('path');

stealTools.export({
  steal: {
    config: path.join(__dirname, '/package.json!npm')
  },
  outputs: {
    '+cjs': {},
    '+amd': {},
    '+global-js': {}
  }
}).catch(function (e) {
  setTimeout(function () {
    throw e;
  }, 1);
});
