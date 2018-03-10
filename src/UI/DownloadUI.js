"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UI_1 = require("./UI");
const blessed_1 = __importDefault(require("blessed"));
const blessed_contrib_1 = __importDefault(require("blessed-contrib"));
const round_1 = require("../utils/round");
const speedometer_1 = __importDefault(require("speedometer"));
class DownloadUI extends UI_1.UI {
    constructor(fullFilename, destination, total) {
        super(fullFilename, destination, total);
    }
    buildUI(barOptions, boxOptions) {
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
                content: '{center}{red-fg}Downloading ' + '{magenta-fg}' + this.fullFilename + '{/magenta-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Speed: {blue-fg}0 KB/s{/}\n' + '{center}Downloaded: {blue-fg}0 MB{/}\n' + 'Remaining: {blue-fg}' + (this.total / 1000000) + ' MB{/}'
            };
        }
        const grid = new blessed_contrib_1.default.grid({
            rows: 12,
            cols: 12,
            screen: this.screen
        });
        const bar = grid.set(8, 0, 4, 12, blessed_contrib_1.default.gauge, barOptions);
        const box = grid.set(0, 0, 8, 12, blessed_1.default.box, boxOptions);
        this.screen.key(['escape', 'q'], (ch, key) => {
            return process.exit(0);
        });
        bar.setPercent(0);
        this.screen.render();
        return { bar, box, screen: this.screen };
    }
    updateUI(status, written, data, isFinished) {
        const downloaded = Number.isNaN(round_1.round(written / 1000000, 2)) ?
            'Unknown' :
            round_1.round(written / 1000000, 2);
        const remaining = Number.isNaN(round_1.round((this.total - written) / 1000000, 2)) ?
            'Unknown' :
            round_1.round((this.total - written) / 1000000, 2);
        const connectionSpeed = Number.isNaN(round_1.round(speedometer_1.default(data.length ? data.length : data) / 1000, 2)) ?
            'Unknown' :
            round_1.round(speedometer_1.default(data.length) / 1000, 2);
        let estimated;
        if (typeof connectionSpeed === 'string' || typeof remaining === 'string') {
            estimated = 'Unknown';
        }
        else {
            estimated = eta(connectionSpeed, remaining);
        }
        const box = status.box;
        const bar = status.bar;
        const screen = status.screen;
        box.setContent('{center}{red-fg}Downloading ' + '{green-fg}' + this.fullFilename + '{/green-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: {#08a573-fg}' + estimated + '{/}\n' + '{center}Speed: {blue-fg} ' + connectionSpeed + ' KB/s{/}\n' + '{center}Downloaded: {blue-fg}' + downloaded + ' MB{/}\n' + '{center}Remaining: {blue-fg}' + remaining + ' MB{/}\n' + (isFinished ? '\n{center}{green-fg}Download finished!{/}\n{center}Press Q or Escape to exit{/}' : ''));
        const totalInMB = round_1.round((this.total / 1000000), 2);
        if (typeof downloaded === 'number') {
            bar.setPercent((100 * downloaded) / totalInMB);
        }
        screen.render();
    }
}
exports.DownloadUI = DownloadUI;
