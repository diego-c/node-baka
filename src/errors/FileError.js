"use strict";
/**
 * Error to be thrown if the source file can't be opened
 * @extends Error
*/
Object.defineProperty(exports, "__esModule", { value: true });
class FileError extends Error {
    /**
     * Instatiates an FileError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    constructor(message) {
        super(message);
        this.name = 'FileError';
    }
}
exports.FileError = FileError;
