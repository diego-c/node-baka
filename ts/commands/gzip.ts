import { GzipUI } from '../UI/GzipUI';
import { checkDestination } from '../utils/checkDestination';
import { checkFilename } from '../utils/checkFilename';
import { Writable, Readable } from 'stream';
import { createReadStream, open, fstat, close, fstatSync, openSync, createWriteStream, WriteStream, ReadStream, Stats } from 'fs';
import path from 'path';
import { round } from '../utils/round';
import { getExtension } from '../utils/getExtension';
import { createGzip, createGunzip } from 'zlib';
import { FileError } from '../errors/FileError';
import { Status } from '../UI/Status';
import { WriteError } from '../errors/WriteError';
import { ReadError } from '../errors/ReadError';

const gzip = (source: string, filename: string = 'file', destination: string = __dirname, password?: string): Promise<Object | null> => {

    return new Promise((resolve: Function, reject: Function) => {

        checkDestination(destination);
        const fullFilename: string = checkFilename(filename, source);

        const sourceFile: ReadStream = createReadStream(source);

        const compressedFile: WriteStream = createWriteStream(path.resolve(destination, fullFilename + '.gz'));

        let UI: GzipUI,
            status: Status;

        open(source, 'r', (err: NodeJS.ErrnoException, fd: number) => {
            if (err) {
                return reject(new FileError('Could not open the source file! ' + err));
            }
            fstat(fd, (err: NodeJS.ErrnoException, stats: Stats) => {
                if (err) {
                    return reject(new FileError('Could not fetch metadata for the source file! ' + err));
                }

                const totalBytes: number = stats.size;
                UI = new GzipUI(fullFilename, destination, totalBytes);
                status = UI.buildUI();
            })
        })

        sourceFile
            .pipe(createGzip())
            .on('data', (chunk: Buffer) => {
                const written: number = compressedFile.bytesWritten;
                UI.updateUI(status, written, chunk, false);
            })
            .on('error', (err: Error) => {
                return reject(new ReadError('Sorry, could not read the source file ' + err));
            })
            .pipe(compressedFile)
            .on('finish', () => {
                console.log('Finished!');
            })
            .on('error', (err: Error) => {
                return reject(new WriteError('Sorry, could not write data to the compressed file ' + err));
            })

        return resolve({ fullFilename, destination });
    })
}

export { gzip };