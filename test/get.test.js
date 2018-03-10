const get = require('../src/commands/get').get,
    { resolve } = require('path'),
    url = 'https://www.petmd.com/sites/default/files/petmd-cat-happy-10.jpg',
    wrongURL = 'wrong url',
    resourceNotFound = 'https://www.petmd.com/sites/default/files/wrongPath/petmd-cat-happy-10.jpg',
    ProtocolError = require('../src/errors/ProtocolError'),
    DownloadError = require('../src/errors/DownloadError');

describe('get <url> command', () => {
    it('downloads cat.jpg to the same directory as the "get" function', () => {
        jest.setTimeout(60000);

        return get(url, 'cat')
            .then(data => expect(data)
                .toEqual({
                    fullFilename: 'cat.jpg',
                    destination: resolve(__dirname, '../src/commands')
                }));
    });

    it('throws a ProtocolError if the URL is invalid', () => {
        return get(wrongURL, 'cat.jpg')
            .catch(err => expect(err instanceof ProtocolError)
                .toBe(true));
    });

    it('throws a DownloadError if the resource was not found at the URL or if the download is interrupted', () => {
        return get(resourceNotFound, 'wrong_file')
            .catch(err => expect(err instanceof DownloadError)
                .toBe(true));
    });
});