"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = __importStar(require("path"));
const on_finished_1 = __importDefault(require("on-finished"));
const checkDestination_1 = require("../utils/checkDestination");
const checkFilename_1 = require("../utils/checkFilename");
const checkProtocol_1 = require("../utils/checkProtocol");
const DownloadError_1 = require("../errors/DownloadError");
const UIError_1 = require("../errors/UIError");
const DownloadUI_1 = require("../UI/DownloadUI");
/**
 * Download a resource from the web
 * @param { string } url URL of the resource to be downloaded
 * @param { string | null } filename Name of the file to be stored. Defaults to "file"
 * @param { string | null } dest Path to store the file. Defaults to the current directory.
 * @returns { Promise<Object | void> } Either resolves with an object containing fullFilename and destination or rejects with an error
 */
const get = (url, filename = 'file', dest = __dirname) => {
    return new Promise((resolve, reject) => {
        checkDestination_1.checkDestination(dest);
        const fullFilename = checkFilename_1.checkFilename(filename, url);
        const protocol = checkProtocol_1.checkProtocol(url);
        protocol.get(url, (res) => {
            const st = fs_1.createWriteStream(path.resolve(dest, fullFilename));
            const total = Number(res.headers['content-length']);
            const UI = new DownloadUI_1.DownloadUI(fullFilename, dest, total);
            let status;
            try {
                status = UI.buildUI();
            }
            catch (err) {
                throw new UIError_1.UIError('Sorry, the UI could not be rendered!');
            }
            res.on('data', d => {
                st.write(d, () => {
                    const written = st.bytesWritten;
                    const isFinished = on_finished_1.default.isFinished(res);
                    try {
                        UI.updateUI(status, written, d, isFinished);
                    }
                    catch (err) {
                        throw new UIError_1.UIError('Sorry, the UI could not be updated!');
                    }
                });
            });
            on_finished_1.default(res, (err) => {
                const downloaded = fs_1.statSync(path.resolve(dest, fullFilename)).size;
                if (!downloaded || (total && (downloaded < total))) {
                    status.box.setContent('{center}{red-fg}Sorry, something went wrong.{/}\n' + '{center}{red-fg}Please double check if the URL provided is correct and try again.{/}\n\n' + '{center}{blue-fg}Press Q or Escape to exit.{/}');
                    status.screen.render();
                    return reject(new DownloadError_1.DownloadError('The download failed! ' + err));
                }
                else {
                    return resolve({ fullFilename, destination: dest });
                }
            });
        }).on('error', (e) => {
            return reject(e);
        });
    })
        .catch((err) => {
        console.log(err);
    });
};
exports.get = get;
