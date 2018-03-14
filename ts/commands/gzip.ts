import gzipSize from 'gzip-size';
import { GzipUI } from '../UI/GzipUI';
import { checkDestination } from '../utils/checkDestination';
import { checkFilename } from '../utils/checkFilename';
import { createReadStream, createWriteStream, WriteStream, ReadStream } from 'fs';
import path from 'path';
import { createGzip } from 'zlib';
import { Status } from '../UI/Status';
import { WriteError } from '../errors/WriteError';
import { ReadError } from '../errors/ReadError';
import { FileError } from '../errors/FileError';
import { createCipher } from 'crypto';

const gzip = (source: string, filename: string = 'file', destination: string = __dirname, password?: string): Promise<Object | null> => {

    return new Promise((resolve: Function, reject: Function) => {

        checkDestination(destination);
        const fullFilename: string = checkFilename(filename, source);

        const sourceFile: ReadStream = createReadStream(source);

        const compressedFile: WriteStream = createWriteStream(path.resolve(destination, fullFilename + '.gz'));

        let UI: GzipUI,
            status: Status,
            written: number,
            currentChunk: Buffer | string;

        gzipSize.file(source)
            .then(size => {

                UI = new GzipUI(fullFilename, destination, size);
                status = UI.buildUI();

                let gzipFile: any = sourceFile.pipe(createGzip());

                if (password) {
                    gzipFile = gzipFile.pipe(createCipher('aes192', password));
                }
                gzipFile
                    .on('data', (chunk: Buffer) => {
                        written = compressedFile.bytesWritten;
                        currentChunk = chunk;
                        UI.updateUI(status, written, chunk, false);
                    })
                    .on('error', (err: Error) => {
                        return reject(new ReadError('Sorry, could not read the source file ' + err));
                    })
                    .pipe(compressedFile)
                    .on('finish', () => {
                        UI.updateUI(status, written, currentChunk, true);
                    })
                    .on('error', (err: Error) => {
                        return reject(new WriteError('Sorry, could not write data to the compressed file ' + err));
                    })
            })
            .catch(err => {
                return reject(new FileError('Could not open the source file! ' + err));
            })

        return resolve({ fullFilename, destination });
    })
}

export { gzip };