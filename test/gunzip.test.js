const { gzip } = require('../src/commands/gzip'),
    { gunzip } = require('../src/commands/gunzip'),
    path = require('path'),
    { createWriteStream, mkdirSync, unlinkSync } = require('fs'),
    destination = path.resolve(__dirname, '../zip-test');

describe('gzip <source> command', () => {
    it('extracts ./zip-test/lorem.txt.gz to ./zip-test/lorem.txt', () => {
        jest.setTimeout(60000);

        mkdirSync(destination);
        const txt = createWriteStream(path.resolve(__dirname, '../zip-test/lorem.txt'));
        txt.setDefaultEncoding('utf8');

        for (let i = 0; i < 10e3; i++) {
            txt.write('Nullam blandit placerat metus, eget finibus enim eleifend vel. Quisque vulputate ante non sodales malesuada. In scelerisque urna eu eleifend tincidunt. Fusce blandit aliquet congue. Aenean eu tristique lorem, quis vehicula nisi. Proin lacus tortor, pretium vestibulum iaculis non, efficitur eu dolor. Ut erat risus, facilisis eu dapibus facilisis, interdum quis quam. Ut euismod mollis erat, at aliquam odio pretium vel. Morbi sit amet vehicula lectus. Sed eros massa, ultricies at molestie nec, efficitur sit amet augue. Nunc aliquam leo vel ipsum varius consectetur. Curabitur consectetur malesuada elit. Suspendisse aliquet convallis venenatis. Phasellus nibh nisi, mattis sed mi vel, fermentum varius mauris. Maecenas porta odio sit amet hendrerit vehicula. Nam ornare mauris urna, ut viverra justo consequat vitae.\n');
        }

        txt.on('finish', () => {
            txt.close();
        });

        txt.on('error', err => {
            console.error(err);
        });

        gzip(path.resolve(__dirname, '../zip-test/lorem.txt'), 'lorem', destination)
            .then(() => {
                unlinkSync(path.resolve(__dirname, '../zip-test/lorem.txt'));

                return gunzip(path.resolve('../zip-test/lorem.txt.gz'), 'lorem', destination)
                    .then(status => expect(status)
                        .toEqual({
                            fullFilename: 'lorem.txt',
                            destination
                        }))
            })
            .catch(err => console.error(err))
    })
})