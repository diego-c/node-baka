module.exports = url => {
    const urlArr = url.split('.');
    return urlArr[urlArr.length - 1];
}
