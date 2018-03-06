const ProgressBar = require('ascii-progress'),
  fs = require('fs'),
  path = require('path'),
  checkDest = require('../utils/checkDestination'),
  getExt = require('../utils/getExtension'),
  log = require('../utils/logToStdout'),
  https = require('https');

module.exports = function (url, filename, dest) {
  checkDest(dest);
  const ext = getExt(url);

  https.get(url, res => {

    const st = fs.createWriteStream(path.resolve(dest, filename + '.' + ext)),
      bar = new ProgressBar({
        schema: ':bar.red :percent.green',
        total: 100
      });

    res.on('data', d => {
      st.write(d, () => {
        log(filename, ext, dest, st, res, bar, d);
      });
      bar.update((st.bytesWritten / res.headers['content-length']));
    });
  }).on('error', e => console.error(e));
}