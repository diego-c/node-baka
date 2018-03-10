"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_1 = __importDefault(require("blessed"));
var blessed_contrib_1 = __importDefault(require("blessed-contrib"));
var buildUI = function (fullFilename, destination, total, barOptions, boxOptions) {
    if (!barOptions) {
        barOptions = {
            tags: true,
            label: '{bold}{#eae54f-fg}Progress{/}',
            percent: [0],
            stroke: 'green',
            fill: 'black'
        };
    }
    if (!boxOptions) {
        boxOptions = {
            tags: true,
            content: '{center}{red-fg}Downloading ' + '{magenta-fg}' + fullFilename + '{/magenta-fg}' + ' to {magenta-fg}' + destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Speed: {blue-fg}0 KB/s{/}\n' + '{center}Downloaded: {blue-fg}0 MB{/}\n' + 'Remaining: {blue-fg}' + (total / 1000000) + ' MB{/}'
        };
    }
    var screen = blessed_1.default.screen({
        smartCSR: true
    });
    var grid = new blessed_contrib_1.default.grid({
        rows: 12,
        cols: 12,
        screen: screen
    });
    var bar = grid.set(8, 0, 4, 12, blessed_contrib_1.default.gauge, barOptions);
    var box = grid.set(0, 0, 8, 12, blessed_1.default.box, boxOptions);
    screen.key(['escape', 'q'], function (ch, key) {
        return process.exit(0);
    });
    bar.setPercent(0);
    screen.render();
    return { bar: bar, box: box, screen: screen };
};
exports.buildUI = buildUI;
