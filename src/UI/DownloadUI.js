"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var UI_1 = require("./UI");
var blessed_1 = __importDefault(require("blessed"));
var blessed_contrib_1 = __importDefault(require("blessed-contrib"));
var round_1 = require("../utils/round");
var getSpeed_1 = require("../utils/getSpeed");
var eta_1 = require("../utils/eta");
var DownloadUI = /** @class */ (function (_super) {
    __extends(DownloadUI, _super);
    function DownloadUI(fullFilename, destination, total) {
        var _this = _super.call(this, fullFilename, destination, total) || this;
        _this._getSpeed = getSpeed_1.getSpeed;
        return _this;
    }
    Object.defineProperty(DownloadUI.prototype, "speed", {
        get: function () {
            return this._getSpeed;
        },
        enumerable: true,
        configurable: true
    });
    DownloadUI.prototype.buildUI = function (barOptions, boxOptions) {
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
        var grid = new blessed_contrib_1.default.grid({
            rows: 12,
            cols: 12,
            screen: this.screen
        });
        var bar = grid.set(8, 0, 4, 12, blessed_contrib_1.default.gauge, barOptions);
        var box = grid.set(0, 0, 8, 12, blessed_1.default.box, boxOptions);
        this.screen.key(['escape', 'q'], function (ch, key) {
            return process.exit(0);
        });
        bar.setPercent(0);
        this.screen.render();
        return { bar: bar, box: box, screen: this.screen };
    };
    DownloadUI.prototype.updateUI = function (status, written, data, isFinished) {
        var downloaded = Number.isNaN(written) ? 'Unknown' : round_1.round(written / 1000000, 2);
        var remaining = round_1.round((this.total - written) / 1000000, 2);
        // TODO: make connectionSpeed more performant. 
        // The way it is right now, the UI doesn't even show up.
        //const connectionSpeed: number = round(this.speed(data.length) / 1000, 2);
        var connectionSpeed = 'Unknown';
        /* const connectionSpeed: (number | string) =
            Number.isNaN(round(speed(data.length) / 1000, 2)) ?
                'Unknown' :
                round(speed(data.length) / 1000, 2) */
        var estimated;
        if (typeof connectionSpeed === 'string' || typeof remaining === 'string') {
            estimated = 'Unknown';
        }
        else {
            estimated = eta_1.eta(connectionSpeed, remaining);
        }
        var box = status.box;
        var bar = status.bar;
        var screen = status.screen;
        box.setContent('{center}{red-fg}Downloading ' + '{green-fg}' + this.fullFilename + '{/green-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: {#08a573-fg}' + estimated + '{/}\n' + '{center}Speed: {blue-fg} ' + connectionSpeed + ' KB/s{/}\n' + '{center}Downloaded: {blue-fg}' + downloaded + ' MB{/}\n' + '{center}Remaining: {blue-fg}' + remaining + ' MB{/}\n' + (isFinished ? '\n{center}{green-fg}Download finished!{/}\n{center}Press Q or Escape to exit{/}' : ''));
        var totalInMB = round_1.round((this.total / 1000000), 2);
        if (typeof downloaded === 'number') {
            bar.setPercent((100 * downloaded) / totalInMB);
        }
        screen.render();
    };
    return DownloadUI;
}(UI_1.UI));
exports.DownloadUI = DownloadUI;
