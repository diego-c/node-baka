"use strict";
/**
 * Error to be thrown if the provided protocol is incorrect
 * @extends Error
*/
class ProtocolError extends Error {
    /**
     * Instatiates a ProtocolError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    constructor(message) {
        super(message);
        this.name = 'ProtocolError';
    }
}
module.exports = ProtocolError;
