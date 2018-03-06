const log = require('single-line-log').stdout,
    speed = require('speedometer')(),
    round = require('./round'),
    eta = require('./eta');

module.exports = (fullFilename, destination, stream, response, bar, data) => {
    const downloaded = round(stream.bytesWritten / 1000000, 2),
        remaining = round((response.headers['content-length'] - stream.bytesWritten) / 1000000, 2),
        connectionSpeed = round(speed(data.length) / 1000, 2),
        ETA = eta(connectionSpeed, remaining);

    log('\n' + 'Downloading ' + fullFilename + ' to ' + destination + '\n\n' + 'ETA: ', ETA + '\n' + 'Downloaded: ', downloaded + ' MB' + '\n' + 'Remaining: ', remaining + ' MB' + '\n' + 'Connection speed: ' + connectionSpeed + ' KB/s');
}