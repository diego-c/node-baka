import * as http from 'http';
import * as https from 'https';

const ProtocolError = require('../errors/ProtocolError');

/**
 * Checks if the provided URL uses the HTTP or the HTTPS protocol and returns the corresponding module for that protocol
 * Throws {@link ProtocolError} if the provided URL uses neither of those protocols
 * @param { string } url The URL to be verified
 * 
 */

const checkProtocol = (url: string): any => {
    if (!(/^https?\:\/\/./.test(url))) {
        throw new ProtocolError('The url must use either the http or the https protocol');
    } else if (/^https:\/\/./.test(url)) {
        return https;
    }
    return http;
}

export { checkProtocol };