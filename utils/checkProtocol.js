const ProtocolError = require('../errors/ProtocolError');

module.exports = url => {
    if (!(/^https?\:\/\/./.test(url))) {
        throw new ProtocolError('The url must use either the http or the https protocol');
    } else if (/^https:\/\/./.test(url)) {
        return require('https');
    }
    return require('http');
}