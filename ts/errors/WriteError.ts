/** 
 * Error to be thrown if the content can't be written to the destination file
 * @extends Error
*/

class WriteError extends Error {
    /**
     * Instatiates an WriteError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    constructor(message: string) {
        super(message);
        this.name = 'WriteError';
    }
}

export { WriteError };