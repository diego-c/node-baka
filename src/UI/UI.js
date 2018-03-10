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
     * @param { string } fullFilename The filename in the format filename._extension_
     * @param { string } destination The path to store the file
     * @param { number } total The total amount of bytes of the file to be transferred
     */
    constructor(fullFilename, destination, total) {
        this.destination = destination;
        this.total = total;
        this.screen = blessed_1.default.screen({
            smartCSR: true
        });
    }
}
exports.UI = UI;
