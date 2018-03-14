import { existsSync, mkdirSync } from 'fs';

/**
 * Checks a destination path
 * If it doesn't exist, creates one or more directories until it's valid
 * @param { string } dest The destination path to be checked
 * @returns { void } 
 */

const checkDestination = (dest: string) => {
    const destinations = dest.split('/');
    let currDest = destinations[0];

    destinations.forEach((_, i) => {
        currDest = destinations.slice(0, i + 1).join('/');
        if (!existsSync(currDest)) {
            mkdirSync(currDest)
        }
    })
}

export { checkDestination };