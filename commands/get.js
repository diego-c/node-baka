const ProgressBar = require('ascii-progress'),
  { createWriteStream } = require('fs'),
  { resolve } = require('path'),
  checkDest = require('../utils/checkDestination'),
  checkFilename = require('../utils/checkFilename'),
  checkProtocol = require('../utils/checkProtocol'),
  log = require('../utils/logToStdout');

module.exports = function (url, filename, dest) {
  filename = filename || 'file';
  dest = dest || __dirname;
  checkDest(dest);
  const fullFilename = checkFilename(filename, url);
  const protocol = checkProtocol(url);

  protocol.get(url, res => {

    const st = createWriteStream(resolve(dest, fullFilename)),
      bar = new ProgressBar({
        schema: ':bar.red :percent.green',
        total: 100
      });

    res.on('data', d => {
      st.write(d, () => {
        const written = st.bytesWritten,
          total = res.headers['content-length'];

        bar.update(written / total);
        log(fullFilename, dest, written, total, d);
      });

    });
  }).on('error', e => console.log(e))
}