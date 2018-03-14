/** 
 * Error to be thrown if the source file can't be read
 * @extends Error
*/

class ReadError extends Error {
    /**
     * Instatiates an ReadError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    constructor(message: string) {
        super(message);
        this.name = 'ReadError';
    }
}

export { ReadError };