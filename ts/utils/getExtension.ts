/**
 * Guess a file extension based on a provided URL
 * @param { string } url The URL to guess the file extension
 * @returns { string } The guessed file extension in the format ._extension_ 
 */

const getExtension = (url: string): string => {
    const urlArr = url.split('.');
    return '.' + urlArr[urlArr.length - 1];
}

export { getExtension };