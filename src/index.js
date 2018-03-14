#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const get_1 = require("./commands/get");
const gzip_1 = require("./commands/gzip");
commander_1.default
    .version('0.1.2', '-v, --version')
    .description('Download files from the web');
commander_1.default
    .command('get <url>')
    .alias('g')
    .description('Fetch a file from the web')
    .option('-d, --destination <dest>', 'Output folder for the fetched file', __dirname)
    .option('-f, --filename <name>', 'Name of the fetched file', 'file')
    .action((url, cmd) => {
    get_1.get(url, cmd.filename, cmd.destination);
});
commander_1.default
    .command('gzip <source>')
    .alias('z')
    .description('Gzip a local file')
    .option('-f, --filename', 'Filename for the compressed file')
    .option('-d, --destination <dest>', 'Destination folder for the compressed file')
    .option('-p, --password', 'Encrypt the file with the given password')
    .action((source, cmd) => {
    gzip_1.gzip(source, cmd.filename, cmd.destination, cmd.password);
});
commander_1.default.parse(process.argv);
