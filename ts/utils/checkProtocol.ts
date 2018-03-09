const ProtocolError = require('../errors/ProtocolError');

/**
 * Checks if the provided URL uses the HTTP or the HTTPS protocol and returns the corresponding module for that protocol
 * Throws {@link ProtocolError} if the provided URL uses neither of those protocols
 * @param { string } url The URL to be verified
 * 
 */

const checkProtocol = (url: string) => {
    if (!(/^https?\:\/\/./.test(url))) {
        throw new ProtocolError('The url must use either the http or the https protocol');
    } else if (/^https:\/\/./.test(url)) {
        return require('https');
    }
    return require('http');
}

module.exports = checkProtocol;