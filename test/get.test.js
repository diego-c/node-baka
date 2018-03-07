const get = require('../commands/get'),
    { resolve } = require('path'),
    url = 'https://www.petmd.com/sites/default/files/petmd-cat-happy-10.jpg';

// to be fixed
describe('get <url> command', () => {
    it('downloads cat.jpg to the same directory as the "get" function', () => {
        jest.setTimeout(60000);
        return wrapper(get, url, 'cat').then(data => expect(data).toEqual({ fullFilename: 'cat.jpg', destination: resolve(__dirname, '../commands/cat.jpg') }));
    });
});

function wrapper(callback, ...args) {

}