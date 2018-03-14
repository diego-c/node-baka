/** 
 * Error to be thrown if the source file can't be opened
 * @extends Error
*/

class FileError extends Error {
    /**
     * Instatiates an FileError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    constructor(message: string) {
        super(message);
        this.name = 'FileError';
    }
}

export { FileError };