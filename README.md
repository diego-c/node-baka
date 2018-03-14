# node-baka

A simple CLI tool with some utilities

# Usage

## `node-baka --help, -h`

Show available commands.

## `node-baka get|g <url> [options]`

Download a file from the web.

__NOTE:__ 

- The `url` __must__ point directly to the file you want to download, e.g. `https://www.(...)/cat.jpg`
- It should start with either `http://` or `https://`

### Options:

#### `-d, --destination <destination>`

Where to store the file. Defaults to the current directory.

__NOTE:__ 

- Prefer Unix-style paths even if you're on Windows, e.g. `~/pics/`
- If the directory doesn't exist, it will be created automatically. Also works for subdirectories.

#### `-f, --filename <filename>`

Name of the file to be downloaded. Defaults to "file".

__NOTE:__ If you don't specify the file extension, node-baka will try to guess based on the `url`. You should avoid omitting it.

## `node-baka gzip|z <source> [options]`

Compress a local file.

__NOTE:__ 

- The `source` path __must__ point directly to the file you want to compress, e.g. `~/docs/file.txt`

### Options:

#### `-d, --destination <destination>`

Where to store the compressed file. Defaults to the current directory.

#### `-f, --filename <filename>`

Name of the compressed file. Defaults to `file._extension_`.

#### `-p, --password <password>`

Encrypt the compressed file with the given password.

## `node-baka gunzip|u <source> [options]`

Extract a local file.

__NOTE:__ 

- The `source` path __must__ point directly to the file you want to extract, e.g. `~/docs/file.txt.gz`

### Options:

#### `-d, --destination <destination>`

Where to store the extracted file. Defaults to the current directory.

#### `-f, --filename <filename>`

Name of the extracted file. Defaults to `file._extension_`.

#### `-p, --password <password>`

Decrypt the compressed file with the given password.

# Installation

`npm install -g node-baka`

# Local build

- Clone the repo: `git clone https://github.com/diego-c/node-baka.git`
- Move to the repo's directory: `cd node-baka`
- Install packages: `npm install or yarn install`

## Run

- With Node: `npm start [command] [options]` or `yarn start [command] [options]`
- As an executable script: `./src/index.js [command] [options]`

## Test

To run all tests: `npm test` or `yarn test`

# API

Check the documentation at [node-baka docs](https://diego-c.github.io/node-baka/ "node-baka documentation")

# Contributing

Issues and PRs are welcome. Please write accompanying tests with your PRs if have the time.
