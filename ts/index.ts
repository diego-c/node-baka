#!/usr/bin/env node

import program, { Command } from 'commander';
import { get } from './commands/get';
import { gzip } from './commands/gzip';

program
    .version('0.2.1', '-v, --version')
    .description('Some CLI utilities')
    .name('node-baka')
    .usage('[command] [options]')

program
    .command('get <url>')
    .alias('g')
    .description('Fetch a file from the web')
    .option('-d, --destination <dest>', 'Output folder for the fetched file', __dirname)
    .option('-f, --filename <name>', 'Name of the fetched file', 'file')
    .action((url: string, cmd: Command) => {
        get(url, cmd.filename, cmd.destination);
    });

program
    .command('gzip <source>')
    .alias('z')
    .description('Gzip a local file')
    .option('-f, --filename <filename>', 'Filename for the compressed file')
    .option('-d, --destination <destination>', 'Destination folder for the compressed file')
    .option('-p, --password <password>', 'Encrypt the file with the given password')
    .action((source: string, cmd: Command) => {
        gzip(source, cmd.filename, cmd.destination, cmd.password);
    })

program.parse(process.argv);
