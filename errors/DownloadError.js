module.exports = class DownloadError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DownloadError';
    }
}