import { ServerResponse, IncomingMessage } from "http";

const { createWriteStream, statSync } = require('fs')
  , blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , path = require('path')
  , onFinished = require('on-finished')
  , checkDest = require('../utils/checkDestination')
  , checkFilename: (filename: string, url: string) => (string) = require('../utils/checkFilename')
  , checkProtocol: (url: string) => any = require('../utils/checkProtocol')
  , updateUI = require('../utils/UI').updateUI
  , buildUI = require('../utils/UI').buildUI
  , DownloadError = require('../errors/DownloadError');

/**
 * Download a resource from the web
 * @param { string } url URL of the resource to be downloaded
 * @param { string | null } filename Name of the file to be stored. Defaults to "file"
 * @param { string | null } dest Path to store the file. Defaults to the current directory.
 */
const get = (url: string, filename = 'file', dest = __dirname) => {

  return new Promise((resolve, reject) => {

    checkDest(dest);
    const fullFilename = checkFilename(filename, url);
    const protocol = checkProtocol(url);

    protocol.get(url, (res: IncomingMessage) => {

      const st = createWriteStream(path.resolve(dest, fullFilename))
        , total = res.headers['content-length'];

      const { bar, box, screen } = buildUI(fullFilename, dest, total);

      res.on('data', d => {
        st.write(d, () => {
          const written = st.bytesWritten;
          const isFinished = onFinished.isFinished(res);
          updateUI(bar, box, screen, fullFilename, dest, written, total, d, isFinished);
        });
      });

      onFinished(res, (err: Error, res: IncomingMessage) => {
        const downloaded = statSync(path.resolve(dest, fullFilename)).size;

        if (!downloaded || (total && (downloaded < total))) {
          box.setContent('{center}{red-fg}Sorry, something went wrong.{/}\n' + '{center}{red-fg}Please double check if the URL provided is correct and try again.{/}\n\n' + '{center}{blue-fg}Press Q or Escape to exit.{/}')
          screen.render();
          return reject(new DownloadError('The download failed! ', err));
        } else {
          return resolve({ fullFilename, destination: dest });
        }
      })
    }).on('error', (e: Error) => {
      return reject(e);
    })
  })
    .catch((err: Error) => {
      console.log(err);
    })
}

export { get };