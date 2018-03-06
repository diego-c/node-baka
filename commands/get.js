const ProgressBar = require('ascii-progress'),
  fs = require('fs'),
  path = require('path'),
  checkDest = require('../utils/checkDestination'),
  checkFilename = require('../utils/checkFilename'),
  checkProtocol = require('../utils/checkProtocol'),
  getExt = require('../utils/getExtension'),
  log = require('../utils/logToStdout');

module.exports = function (url, filename, dest) {
  filename = filename || 'file';
  dest = dest || __dirname;
  checkDest(dest);
  const fullFilename = checkFilename(filename, url);
  const protocol = checkProtocol(url);

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