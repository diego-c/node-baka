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
var fs_1 = require("fs");
var path = __importStar(require("path"));
var on_finished_1 = __importDefault(require("on-finished"));
var checkDestination_1 = require("../utils/checkDestination");
var checkFilename_1 = require("../utils/checkFilename");
var checkProtocol_1 = require("../utils/checkProtocol");
var DownloadError_1 = require("../errors/DownloadError");
var UIError_1 = require("../errors/UIError");
/* import { DownloadUI } from '../UI/DownloadUI';
import { buildUI } from '../UI/buildUI';
import { updateUI } from '../UI/updateUI'; */
var UI_1 = require("../utils/UI");
/**
 * Download a resource from the web
 * @param { string } url URL of the resource to be downloaded
 * @param { string | null } filename Name of the file to be stored. Defaults to "file"
 * @param { string | null } dest Path to store the file. Defaults to the current directory.
 */
var get = function (url, filename, dest) {
    if (filename === void 0) { filename = 'file'; }
    if (dest === void 0) { dest = __dirname; }
    return new Promise(function (resolve, reject) {
        checkDestination_1.checkDestination(dest);
        var fullFilename = checkFilename_1.checkFilename(filename, url);
        var protocol = checkProtocol_1.checkProtocol(url);
        protocol.get(url, function (res) {
            var st = fs_1.createWriteStream(path.resolve(dest, fullFilename));
            var total = Number(res.headers['content-length']);
            var bar, box, screen;
            try {
                var status = UI_1.buildUI(fullFilename, dest, total);
                bar = status.bar;
                box = status.box;
                screen = status.screen;
            }
            catch (err) {
                throw new UIError_1.UIError('Sorry, the UI could not be rendered!');
            }
            //const { bar, box, screen } = buildUI(fullFilename, dest, total)
            //const status: Status = buildUI(fullFilename, dest, total);
            /* const UI: DownloadUI = new DownloadUI(fullFilename, dest, total);
            const status: Status = UI.buildUI() */
            res.on('data', function (d) {
                st.write(d, function () {
                    var written = st.bytesWritten;
                    var isFinished = on_finished_1.default.isFinished(res);
                    //UI.updateUI(status, written, d, isFinished);
                    //updateUI(status, fullFilename, dest, written, d, total, isFinished);
                    try {
                        UI_1.updateUI(bar, box, screen, fullFilename, dest, written, total, d, isFinished);
                    }
                    catch (err) {
                        throw new UIError_1.UIError('Sorry, the UI could not be updated!');
                    }
                });
            });
            on_finished_1.default(res, function (err, res) {
                var downloaded = fs_1.statSync(path.resolve(dest, fullFilename)).size;
                if (!downloaded || (total && (downloaded < total))) {
                    box.setContent('{center}{red-fg}Sorry, something went wrong.{/}\n' + '{center}{red-fg}Please double check if the URL provided is correct and try again.{/}\n\n' + '{center}{blue-fg}Press Q or Escape to exit.{/}');
                    screen.render();
                    return reject(new DownloadError_1.DownloadError('The download failed! ' + err));
                }
                else {
                    return resolve({ fullFilename: fullFilename, destination: dest });
                }
            });
        }).on('error', function (e) {
            return reject(e);
        });
    })
        .catch(function (err) {
        console.log(err);
    });
};
exports.get = get;