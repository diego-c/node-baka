"use strict";
/**
 * Error to be thrown if the source file can't be read
 * @extends Error
*/
Object.defineProperty(exports, "__esModule", { value: true });
class ReadError extends Error {
    /**
     * Instatiates an ReadError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    constructor(message) {
        super(message);
        this.name = 'ReadError';
    }
}
exports.ReadError = ReadError;
