/** 
 * Error to be thrown if the download is unsuccessful
 * @extends Error
*/

class DownloadError extends Error {
    /**
     * Instatiates a DownloadError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    constructor(message: string) {
        super(message);
        this.name = 'DownloadError';
    }
}

module.exports = DownloadError;