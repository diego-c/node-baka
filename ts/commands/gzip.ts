import { GzipUI } from '../UI/GzipUI';
import { checkDestination } from '../utils/checkDestination';
import { checkFilename } from '../utils/checkFilename';
import { Writable, Readable } from 'stream';
import { createReadStream, open, fstat, close, fstatSync, openSync, createWriteStream, WriteStream, ReadStream } from 'fs';
import path from 'path';
import { round } from '../utils/round';
import { createGzip, createGunzip } from 'zlib';

const gzip = (source: string, filename: string = 'file', destination: string = __dirname, password?: string): Promise<Object | null> => {

    checkDestination(destination);
    const fullFilename: string = checkFilename(filename, source);

    return new Promise((resolve: Function, reject: Function) => {

        const sourceFile: ReadStream = createReadStream(source);

        const compressedFile: WriteStream = createWriteStream(path.resolve(destination, fullFilename + '.gz'));

        sourceFile
            .pipe(createGzip())
            .on('data', (chunk: Buffer) => {
                console.log('Compressed: ' + round(chunk.length / 1000000, 2) + ' MB');
            })
            .pipe(compressedFile)
            .on('finish', () => {
                console.log('Finished!');
            });
    })
}

export { gzip };