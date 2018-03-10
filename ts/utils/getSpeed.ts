const speed = require('speedometer')();

const getSpeed = (dataLength: number): number => {
    return speed(dataLength)
}

export { getSpeed };