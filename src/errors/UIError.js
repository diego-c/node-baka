"use strict";
/**
 * Error to be thrown if the UI can't be properly rendered
 * @extends Error
*/
Object.defineProperty(exports, "__esModule", { value: true });
class UIError extends Error {
    /**
     * Instatiates an UIError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    constructor(message) {
        super(message);
        this.name = 'UIError';
    }
}
exports.UIError = UIError;
