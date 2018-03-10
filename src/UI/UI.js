"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_1 = __importDefault(require("blessed"));
/**
 * Base class to be extended for different types of UI
 */
var UI = /** @class */ (function () {
    /**
     * @param { string } _fullFilename The filename in the format filename._extension_
     * @param { string } _destination The path to store the file
     * @param { number } _total The total amount of bytes of the file to be transferred
     */
    function UI(fullFilename, destination, total) {
        this._screen = blessed_1.default.screen({
            smartCSR: true
        });
        this._fullFilename = fullFilename;
        this._destination = destination;
        this._total = total;
    }
    Object.defineProperty(UI.prototype, "screen", {
        get: function () {
            return this._screen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UI.prototype, "fullFilename", {
        get: function () {
            return this._fullFilename;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UI.prototype, "destination", {
        get: function () {
            return this._destination;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UI.prototype, "total", {
        get: function () {
            return this._total;
        },
        enumerable: true,
        configurable: true
    });
    return UI;
}());
exports.UI = UI;
