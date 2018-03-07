const log = require('single-line-log').stdout,
    speed = require('speedometer')(),
    round = require('./round'),
    eta = require('./eta');

/**
 * Logs the current status of the file transfer to stdout
 * @param { string } fullFilename The full filename in the format <filename>.<extension>
 * @param { string } destination The path to store the file
 * @param { number } written The current amount of bytes written to the file
 * @param { number } total The total amount of bytes to be written to the file
 * @param { number } data The data payload (in bytes) transferred
 * @param { boolean } isFinished Check if the file has finished downloading
 * @returns { void } The formatted message to be logged
 * 
 */

const logToStdout = (fullFilename, destination, written, total, data, isFinished) => {

    const downloaded = round(written / 1000000, 2),
        remaining = round((total - written) / 1000000, 2),
        connectionSpeed = round(speed(data.length) / 1000, 2),
        ETA = eta(connectionSpeed, remaining);

    log('\n' + 'Downloading ' + fullFilename + ' to ' + destination + '\n\n' + 'ETA: ', ETA + '\n' + 'Downloaded: ', downloaded + ' MB' + '\n' + 'Remaining: ', remaining + ' MB' + '\n' + 'Connection speed: ' + connectionSpeed + ' KB/s' + '\n' + (isFinished ? '\nDownload finished!' : ''));
}

module.exports = logToStdout;