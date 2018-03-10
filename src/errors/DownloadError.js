"use strict";
/**
 * Error to be thrown if the download is unsuccessful
 * @extends Error
*/
Object.defineProperty(exports, "__esModule", { value: true });
class DownloadError extends Error {
    /**
     * Instatiates a DownloadError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    constructor(message) {
        super(message);
        this.name = 'DownloadError';
    }
}
exports.DownloadError = DownloadError;
