const ProgressBar = require('ascii-progress'),
  fs = require('fs'),
  path = require('path'),
  checkDest = require('../utils/checkDestination'),
  getExt = require('../utils/getExtension'),
  log = require('../utils/logToStdout');

module.exports = function (url, filename, dest) {
  checkDest(dest);
  const ext = getExt(url);

  let protocol = null;

  /^https:\/\/./.test(url) ?
    protocol = require('https') :
    protocol = require('http');

  protocol.get(url, res => {

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