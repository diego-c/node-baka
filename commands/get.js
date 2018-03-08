const ProgressBar = require('ascii-progress')
  , { createWriteStream, statSync } = require('fs')
  , blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , path = require('path')
  , onFinished = require('on-finished')
  , checkDest = require('../utils/checkDestination')
  , checkFilename = require('../utils/checkFilename')
  , checkProtocol = require('../utils/checkProtocol')
  , updateUI = require('../utils/UI').updateUI
  , buildUI = require('../utils/UI').buildUI
  , DownloadError = require('../errors/DownloadError');

/**
 * Download a resource from the web
 * @param { string } url URL of the resource to be downloaded
 * @param { string | null } filename Name of the file to be stored. Defaults to "file"
 * @param { string | null } dest Path to store the file. Defaults to the current directory.
 */
const get = (url, filename = 'file', dest = __dirname) => {

  return new Promise((resolve, reject) => {

    checkDest(dest);
    const fullFilename = checkFilename(filename, url);
    const protocol = checkProtocol(url);

    protocol.get(url, res => {

      const st = createWriteStream(path.resolve(dest, fullFilename))
        , total = res.headers['content-length'];

      const { box, screen } = buildUI(fullFilename, dest, total);

      res.on('data', d => {
        st.write(d, () => {
          const written = st.bytesWritten;
          //bar.update(written / total);
          const isFinished = onFinished.isFinished(res);
          updateUI(box, screen, fullFilename, dest, written, total, d, isFinished);
        });
      });

      onFinished(res, (err, res) => {
        const downloaded = statSync(path.resolve(dest, fullFilename)).size;

        if (!downloaded || (total && (downloaded < total))) {
          box.setContent('{center}{red-fg}Sorry, something went wrong.{/}\n' + '{center}{red-fg}Please double check if the URL provided is correct and try again.{/}\n\n' + '{center}{blue-fg}Press Q or Escape to exit.{/}')
          screen.render();
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

module.exports = get;