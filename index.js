#!/usr/bin/env node

const program = require('commander'),
    get = require('./commands/get');

program
    .version('0.1.2', '-v, --version')
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
