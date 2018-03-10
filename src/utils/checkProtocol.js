"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProtocolError = require('../errors/ProtocolError');
/**
 * Checks if the provided URL uses the HTTP or the HTTPS protocol and returns the corresponding module for that protocol
 * Throws {@link ProtocolError} if the provided URL uses neither of those protocols
 * @param { string } url The URL to be verified
 *
 */
exports.default = (url) => __awaiter(this, void 0, void 0, function* () {
    if (!(/^https?\:\/\/./.test(url))) {
        throw new ProtocolError('The url must use either the http or the https protocol');
    }
    else if (/^https:\/\/./.test(url)) {
        return yield Promise.resolve().then(() => __importStar(require('https')));
    }
    return yield Promise.resolve().then(() => __importStar(require('http')));
});
