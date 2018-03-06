module.exports = (num, precision) => {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}