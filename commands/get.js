const ProgressBar = require('ascii-progress'),
  { createWriteStream, statSync } = require('fs'),
  path = require('path'),
  onFinished = require('on-finished'),
  checkDest = require('../utils/checkDestination'),
  checkFilename = require('../utils/checkFilename'),
  checkProtocol = require('../utils/checkProtocol'),
  log = require('../utils/logToStdout'),
  DownloadError = require('../errors/DownloadError');

module.exports = function (url, filename, dest) {
  return new Promise((resolve, reject) => {

    filename = filename || 'file';
    dest = dest || __dirname;
    checkDest(dest);
    const fullFilename = checkFilename(filename, url);
    const protocol = checkProtocol(url);

    protocol.get(url, res => {

      const st = createWriteStream(path.resolve(dest, fullFilename)),
        bar = new ProgressBar({
          schema: ':bar.red :percent.green',
          total: 100
        }),
        total = res.headers['content-length'];

      res.on('data', d => {
        st.write(d, () => {
          const written = st.bytesWritten;

          bar.update(written / total);
          const isFinished = onFinished.isFinished(res);

          log(fullFilename, dest, written, total, d, isFinished);
        });
      });

      onFinished(res, (err, res) => {
        const downloaded = statSync(path.resolve(dest, fullFilename)).size;

        if (!downloaded || (total && (downloaded < total))) {
          return reject(new DownloadError('The download failed! ', err));
        } else {
          return resolve({ fullFilename, destination: dest });
        }
      })
    }).on('error', e => {
      return reject(e);
    })
  })
    .catch(err => {
      console.log(err);
    })
}