module.exports = class ProtocolError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ProtocolError';
    }
}