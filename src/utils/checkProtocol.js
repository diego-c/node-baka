"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var ProtocolError = require('../errors/ProtocolError');
/**
 * Checks if the provided URL uses the HTTP or the HTTPS protocol and returns the corresponding module for that protocol
 * Throws {@link ProtocolError} if the provided URL uses neither of those protocols
 * @param { string } url The URL to be verified
 *
 */
var checkProtocol = function (url) {
    if (!(/^https?\:\/\/./.test(url))) {
        throw new ProtocolError('The url must use either the http or the https protocol');
    }
    else if (/^https:\/\/./.test(url)) {
        return https;
    }
    return http;
};
exports.checkProtocol = checkProtocol;
