import { UI } from "./UI";
import { Status } from "./Status";
import blessed, { Widgets } from "blessed";
import contrib, { Widgets as ContribWidgets } from 'blessed-contrib';
import { round } from "../utils/round";
import { getSpeed } from '../utils/getSpeed';
import { eta } from "../utils/eta";

/**
 * Class to generate UIs for downloading files
 * @extends UI
 */
class DownloadUI extends UI {

    private _getSpeed: Function;

    /**
     * Instantiate a new DownloadUI  
     * @param { string } fullFilename The filename in the format filename._extension_ 
     * @param { string } destination The path to store the file
     * @param { number } total The total amount of bytes of the file to be transferred
     */

    constructor(fullFilename: string, destination: string, total: number) {
        super(fullFilename, destination, total);
        this._getSpeed = getSpeed;
    }

    /**
     * Getter for the speed connection function
     * @returns { Function }
     */

    get speed(): Function {
        return this._getSpeed;
    }

    /**
       * DownloadUI implementation of buildUI 
       * @param { ContribWidgets.GaugeOptions | null } barOptions Options for the gauge progress bar to be displayed in the UI
       * @param { Widgets.BoxOptions | null } boxOptions Options for the text box to be displayed in the UI
       * @returns { Status } The current Status of the rendered elements 
       */

    buildUI(barOptions?: ContribWidgets.GaugeOptions, boxOptions?: Widgets.BoxOptions): Status {

        if (!barOptions) {
            barOptions = {
                tags: true,
                label: '{bold}{#eae54f-fg}Progress{/}',
                percent: [0],
                stroke: 'green',
                fill: 'black'
            }
        }

        if (!boxOptions) {
            boxOptions = {
                tags: true,
                content: '{center}{red-fg}Downloading ' + '{magenta-fg}' + this.fullFilename + '{/magenta-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Speed: {blue-fg}0 KB/s{/}\n' + '{center}Downloaded: {blue-fg}0 MB{/}\n' + 'Remaining: {blue-fg}' + round(this.total / 1000000, 2) + ' MB{/}'
            }
        }

        const grid = new contrib.grid({
            rows: 12,
            cols: 12,
            screen: this.screen
        });

        const bar = grid.set(8, 0, 4, 12, contrib.gauge, barOptions);

        const box = grid.set(0, 0, 8, 12, blessed.box, boxOptions);

        this.screen.key(['escape', 'q'], () => {
            return process.exit(0);
        });

        bar.setPercent(0);
        this.screen.render();
        return { bar, box, screen: this.screen };
    }

    /**
    * DownloadUI implementation of updateUI
    * @param { Status } status The current status object to be updated 
    * @param { number } written The amount of bytes written to the file 
    * @param { Buffer | string } data The amount of bytes transferred  
    * @param { boolean } isFinished Check if the download has finished
    * @returns { void } 
    */

    updateUI(status: Status, written: number, data: (Buffer | string), isFinished: boolean) {

        let downloaded: (string | number), remaining: (string | number), totalInMB: number = round(this.total / 1000000, 2);

        if (Number.isNaN(written)) {
            downloaded = 'Unknown';
            remaining = 'Unknown';
        } else {
            downloaded = round((written / 1000000), 2);
            remaining = round((this.total - written) / 1000000, 2);
        }

        let speed: (number | string);
        if (data.length) {
            speed = round(getSpeed(data.length / 1000), 2);
        } else {
            speed = 'Unknown';
        }

        let estimated: string;

        if ((typeof remaining === 'number') && (typeof speed === 'number')) {
            estimated = eta(speed, remaining);
        } else {
            estimated = 'Unknown';
        }

        status.box.setContent('{center}{red-fg}Downloading ' + '{green-fg}' + this.fullFilename + '{/green-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: {#08a573-fg}' + estimated + '{/}\n' + '{center}Speed: {blue-fg} ' + speed + ' KB/s{/}\n' + '{center}Downloaded: {blue-fg}' + downloaded + ' MB{/}\n' + '{center}Remaining: {blue-fg}' + remaining + ' MB{/}\n' + (isFinished ? '\n{center}{green-fg}Download finished!{/}\n{center}Press Q or Escape to exit{/}' : ''));

        // TODO: fix bar % when going from 0 MB to the total / 100 (MB)
        let percent: number;
        if (typeof downloaded === 'number') {
            percent = downloaded < (totalInMB / 100) ? round(downloaded / totalInMB, 2) : round(downloaded * 100 / totalInMB, 2);
        } else {
            percent = 0;
        }
        status.bar.setPercent(percent);

        this.screen.render();
    }
}

export { DownloadUI };