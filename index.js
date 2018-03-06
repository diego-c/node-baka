#!/usr/bin/env node

//const url = 'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4';

const program = require('commander'),
    get = require('./commands/get');

program
    .version('0.0.1', '-v, --version')
    .description('Download files from the web');

program
    .command('get <url>')
    .alias('g')
    .description('Fetch a file from the web')
    .option('-d, --destination <dest>', 'Output folder for the fetched file', __dirname)
    .option('-f, --filename <name>', 'Name of the fetched file', 'file')
    .action((url, cmd) => {
        get(url, cmd.filename, cmd.destination);
    });

program.parse(process.argv);
