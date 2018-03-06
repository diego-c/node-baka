module.exports = url => {
    if (!(/^https:\/\/./.test(url) || /^http:\/\/./.test(url))) {
        throw new TypeError('The url must use either the http or the https protocol');
    } else if (/^https:\/\/./.test(url)) {
        return require('https');
    }
    return require('http');
}