"use strict";
/**
 * Error to be thrown if the content can't be written to the destination file
 * @extends Error
*/
Object.defineProperty(exports, "__esModule", { value: true });
class WriteError extends Error {
    /**
     * Instatiates an WriteError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    constructor(message) {
        super(message);
        this.name = 'WriteError';
    }
}
exports.WriteError = WriteError;
