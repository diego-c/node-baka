"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('fs'), createWriteStream = _a.createWriteStream, statSync = _a.statSync, blessed = require('blessed'), contrib = require('blessed-contrib'), path = require('path'), onFinished = require('on-finished'), checkDest = require('../utils/checkDestination'), checkFilename = require('../utils/checkFilename'), checkProtocol = require('../utils/checkProtocol'), updateUI = require('../utils/UI').updateUI, buildUI = require('../utils/UI').buildUI, DownloadError = require('../errors/DownloadError');
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
        checkDest(dest);
        var fullFilename = checkFilename(filename, url);
        var protocol = checkProtocol(url);
        protocol.get(url, function (res) {
            var st = createWriteStream(path.resolve(dest, fullFilename)), total = res.headers['content-length'];
            var _a = buildUI(fullFilename, dest, total), bar = _a.bar, box = _a.box, screen = _a.screen;
            res.on('data', function (d) {
                st.write(d, function () {
                    var written = st.bytesWritten;
                    var isFinished = onFinished.isFinished(res);
                    updateUI(bar, box, screen, fullFilename, dest, written, total, d, isFinished);
                });
            });
            onFinished(res, function (err, res) {
                var downloaded = statSync(path.resolve(dest, fullFilename)).size;
                if (!downloaded || (total && (downloaded < total))) {
                    box.setContent('{center}{red-fg}Sorry, something went wrong.{/}\n' + '{center}{red-fg}Please double check if the URL provided is correct and try again.{/}\n\n' + '{center}{blue-fg}Press Q or Escape to exit.{/}');
                    screen.render();
                    return reject(new DownloadError('The download failed! ', err));
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
module.exports = get;
