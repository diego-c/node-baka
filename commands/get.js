const ProgressBar = require('ascii-progress'),
  fs = require('fs'),
  path = require('path'),
  checkDest = require('../utils/checkDestination'),
  getExt = require('../utils/getExtension'),
  log = require('../utils/logToStdout');

module.exports = function (url, filename, dest) {
  filename = filename || 'file';
  dest = dest || __dirname;
  checkDest(dest);

  let fullFilename = filename;
  if (!/\..+/.test(filename)) {
    fullFilename = '' + filename + getExt(url)
  }

  let protocol = null;

  if (!(/^https:\/\/./.test(url) || /^http:\/\/./.test(url))) {
    throw new TypeError('The url must use either the http or the https protocol');
  } else if (/^https:\/\/./.test(url)) {
    protocol = require('https');
  } else {
    protocol = require('http');
  }

  protocol.get(url, res => {

    const st = fs.createWriteStream(path.resolve(dest, fullFilename)),
      bar = new ProgressBar({
        schema: ':bar.red :percent.green',
        total: 100
      });

    res.on('data', d => {
      st.write(d, () => {
        log(fullFilename, dest, st, res, bar, d);
      });
      bar.update((st.bytesWritten / res.headers['content-length']));
    });
  }).on('error', e => console.log(e))
}