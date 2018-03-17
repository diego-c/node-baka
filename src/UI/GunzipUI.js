"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UI_1 = require("./UI");
const blessed_contrib_1 = __importDefault(require("blessed-contrib"));
const blessed_1 = __importDefault(require("blessed"));
const round_1 = require("../utils/round");
const eta_1 = require("../utils/eta");
/**
 * Class to generate UIs for compressing files
 * @extends UI
 */
class GunzipUI extends UI_1.UI {
    /**
     * Instantiate a new GunzipUI
     * @param { string } fullFilename The filename in the format filename._extension_
     * @param { string } destination The path to store the uncompressed file
     * @param { number } total The total amount of bytes of the source file
     */
    constructor(fullFilename, destination, total) {
        super(fullFilename, destination, total);
    }
    /**
      * GunzipUI implementation of buildUI
      * @param { ContribWidgets.GaugeOptions | null } barOptions Options for the gauge progress bar to be displayed in the UI
      * @param { Widgets.BoxOptions | null } boxOptions Options for the text box to be displayed in the UI
      * @returns { Status } The current Status of the rendered elements
      */
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
                content: '{center}{red-fg}Extracting ' + '{magenta-fg}' + this.fullFilename + '{/magenta-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Uncompressed: {blue-fg}0 MB{/}\n' + '{center}Speed: {blue-fg}0 KB/s{/}\n' + 'Compressed size: {blue-fg}' + round_1.round(this.total / 1000000, 2) + ' MB{/}'
            };
        }
        const grid = new blessed_contrib_1.default.grid({
            rows: 12,
            cols: 12,
            screen: this.screen
        });
        const bar = grid.set(8, 0, 4, 12, blessed_contrib_1.default.gauge, barOptions);
        const box = grid.set(0, 0, 8, 12, blessed_1.default.box, boxOptions);
        this.screen.key(['escape', 'q'], () => {
            return process.exit(0);
        });
        bar.setPercent(0);
        this.screen.render();
        return { bar, box, screen: this.screen };
    }
    /**
   * GunzipUI implementation of updateUI
   * @param { Status } status The current status object to be updated
   * @param { number } written The amount of bytes written to the uncompressed file
   * @param { Buffer | string } data The amount of bytes transferred
   * @param { boolean } isFinished Check if the extraction has finished
   * @returns { void }
   */
    updateUI(status, written, data, isFinished) {
        let bar = status.bar, box = status.box;
        const writtenMB = round_1.round(written / 1000000, 2);
        const dataKB = round_1.round(data.length / 1000, 2);
        const remainingMB = round_1.round((this.total - written) / 1000000, 2);
        const ETA = eta_1.eta(dataKB, remainingMB);
        box.setContent('{center}{yellow-fg}Extracting{/yellow-fg} ' + '{green-fg}' + this.fullFilename + '{/green-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: ' + '{green-fg}' + ETA + '{/}\n' + '{center}Uncompressed: {blue-fg}' + writtenMB + ' MB{/}\n' + '{center}Speed: {blue-fg}' + dataKB + ' KB/s{/}\n' + 'Compressed size: {blue-fg}' + round_1.round(this.total / 1000000, 2) + ' MB{/}' + '\n\n' + (isFinished ? '{center}{green-fg}Done!{/}\n' + '{center}{red-fg}Press Q or Escape to quit{/}' : ''));
        let percent;
        if (isFinished) {
            percent = 100;
        }
        else if (100 * written <= this.total) {
            percent = written / this.total;
        }
        else {
            percent = (100 * written) / this.total;
        }
        bar.setPercent(percent);
        this.screen.render();
    }
}
exports.GunzipUI = GunzipUI;
