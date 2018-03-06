const get = require('../commands/get'),
    url = 'https://player.vimeo.com/external/189545487.hd.mp4?s=131fa753bd9d7d6085af29f3603f4b65cbb3ab31&profile_id=174&oauth2_token_id=57447761';

// to be fixed
describe('get <url> command', () => {
    it('downloads vid.mp4 to the current directory', () => {
        jest.setTimeout(60000);
        return expect(get(url, 'vid.mp4')).resolves.toBe({ filename: 'vid.mp4', extension: '.mp4', destination: __dirname });
    });
});