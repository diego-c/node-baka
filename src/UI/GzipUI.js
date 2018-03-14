"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UI_1 = require("./UI");
const blessed_contrib_1 = __importDefault(require("blessed-contrib"));
const blessed_1 = __importDefault(require("blessed"));
const round_1 = require("../utils/round");
class GzipUI extends UI_1.UI {
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
                content: '{center}{red-fg}Compressing ' + '{magenta-fg}' + this.fullFilename + '{/magenta-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Written: {blue-fg}0 MB{/}\n' + '{center}Data length: {blue-fg}0 MB{/}\n' + 'Total: {blue-fg}' + round_1.round(this.total / 1000000, 2) + ' MB{/}'
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
        let bar = status.bar, box = status.box;
        const writtenMB = round_1.round(written / 1000000, 2);
        const dataMB = round_1.round(data.length / 1000000, 2);
        box.setContent('{center}{yellow-fg}Compressing{/yellow-fg} ' + '{green-fg}' + this.fullFilename + '{/green-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Written: {blue-fg}' + writtenMB + ' MB{/}\n' + '{center}Data length: {blue-fg}' + dataMB + ' MB{/}\n' + 'Total: {blue-fg}' + round_1.round(this.total / 1000000, 2) + ' MB{/}');
        let percent;
        if (100 * written <= this.total) {
            percent = written / this.total;
        }
        else {
            percent = (100 * written) / this.total;
        }
        bar.setPercent(percent);
        this.screen.render();
    }
}
exports.GzipUI = GzipUI;
