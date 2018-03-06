module.exports = (filename, url) => {
    let fullFilename = filename;
    if (!/\..+/.test(filename)) {
        fullFilename = '' + filename + require('./getExtension')(url)
    }
    return fullFilename;
}