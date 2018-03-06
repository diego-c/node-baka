const { existsSync, mkdirSync } = require('fs');

module.exports = dest => {
    const destinations = dest.split('/');
    let currDest = destinations[0];

    destinations.forEach((destination, i) => {
        currDest = destinations.slice(0, i + 1).join('/');
        if (!existsSync(currDest)) {
            mkdirSync(currDest)
        }
    })
}
