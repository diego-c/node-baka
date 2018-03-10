/** 
 * Error to be thrown if the UI can't be properly rendered
 * @extends Error
*/

class UIError extends Error {
    /**
     * Instatiates an UIError to be thrown
     * @param { string } message Message to be displayed when the error is thrown
     */
    constructor(message: string) {
        super(message);
        this.name = 'UIError';
    }
}

export { UIError };