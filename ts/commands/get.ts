import { createWriteStream, statSync } from 'fs';
import blessed, { Widgets } from 'blessed';
import contrib, { Widgets as ContribWidgets } from 'blessed-contrib';
import * as path from 'path';
import onFinished from 'on-finished';
import { checkDestination } from '../utils/checkDestination';
import * as https from "https";
import { Status } from "../UI/Status";
import { checkFilename } from '../utils/checkFilename';
import { checkProtocol } from '../utils/checkProtocol';
import { DownloadError } from '../errors/DownloadError';
import { UIError } from '../errors/UIError';
import { IncomingMessage } from 'http';
import { DownloadUI } from '../UI/DownloadUI';

/**
 * Download a resource from the web
 * @param { string } url URL of the resource to be downloaded
 * @param { string | null } filename Name of the file to be stored. Defaults to "file"
 * @param { string | null } dest Path to store the file. Defaults to the current directory.
 */
const get = (url: string, filename = 'file', dest = __dirname) => {

  return new Promise((resolve, reject) => {

    checkDestination(dest);
    const fullFilename = checkFilename(filename, url);
    const protocol: any = checkProtocol(url);

    protocol.get(url, (res: IncomingMessage) => {

      const st = createWriteStream(path.resolve(dest, fullFilename))
      const total: number = Number(res.headers['content-length']);

      const UI: DownloadUI = new DownloadUI(fullFilename, dest, total);

      let status: Status;
      try {
        status = UI.buildUI();
      } catch (err) {
        throw new UIError('Sorry, the UI could not be rendered!');
      }

      res.on('data', d => {
        st.write(d, () => {
          const written = st.bytesWritten;
          const isFinished = onFinished.isFinished(res);

          try {
            UI.updateUI(status, written, d, isFinished);
          } catch (err) {
            throw new UIError('Sorry, the UI could not be updated!');
          }
        });
      });

      onFinished(res, (err: Error, res: IncomingMessage) => {
        const downloaded = statSync(path.resolve(dest, fullFilename)).size;

        if (!downloaded || (total && (downloaded < total))) {
          status.box.setContent('{center}{red-fg}Sorry, something went wrong.{/}\n' + '{center}{red-fg}Please double check if the URL provided is correct and try again.{/}\n\n' + '{center}{blue-fg}Press Q or Escape to exit.{/}')
          status.screen.render();
          return reject(new DownloadError('The download failed! ' + err));
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