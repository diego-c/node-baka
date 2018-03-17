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
     * Base constructor to be extended for UIs
     * @param { string } fullFilename The filename in the format filename._extension_
     * @param { string } destination The path to store the file
     * @param { number } total The total amount of bytes of the file to be transferred
     */
    constructor(fullFilename, destination, total) {
        this._screen = blessed_1.default.screen({
            smartCSR: true
        });
        this._fullFilename = fullFilename;
        this._destination = destination;
        this._total = total;
    }
    /**
     * Getter for screen
     * @returns { Widgets.Screen }
     */
    get screen() {
        return this._screen;
    }
    /**
     * Getter for fullFilename
     * @returns { string }
     */
    get fullFilename() {
        return this._fullFilename;
    }
    /**
     * Getter for destination
     * @returns { string }
     */
    get destination() {
        return this._destination;
    }
    /**
     * Getter for the total amount of bytes
     * @returns { number }
     */
    get total() {
        return this._total;
    }
}
exports.UI = UI;
