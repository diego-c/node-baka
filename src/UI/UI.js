"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blessed_1 = __importDefault(require("blessed"));
/**
 * Base class to be extended for different types of UI
 */
class UI {
    /**
     * @param { string } _fullFilename The filename in the format filename._extension_
     * @param { string } _destination The path to store the file
     * @param { number } _total The total amount of bytes of the file to be transferred
     */
    constructor(fullFilename, destination, total) {
        this._screen = blessed_1.default.screen({
            smartCSR: true
        });
        this._fullFilename = fullFilename;
        this._destination = destination;
        this._total = total;
    }
    get screen() {
        return this._screen;
    }
    get fullFilename() {
        return this._fullFilename;
    }
    get destination() {
        return this._destination;
    }
    get total() {
        return this._total;
    }
}
exports.UI = UI;
