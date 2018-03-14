import { UI } from './UI';
import { Status } from './Status';
import contrib, { Widgets as ContribWidgets } from 'blessed-contrib';
import blessed, { Widgets } from 'blessed';
import { round } from '../utils/round';
import { eta } from '../utils/eta';

/**
 * Class to generate UIs for compressing files
 * @extends UI
 */
class GunzipUI extends UI {

    /**
     * Instantiate a new GunzipUI  
     * @param { string } fullFilename The filename in the format filename._extension_ 
     * @param { string } destination The path to store the uncompressed file
     * @param { number } total The total amount of bytes of the source file
     */

    constructor(fullFilename: string, destination: string, total: number) {
        super(fullFilename, destination, total);
    }

    /**
      * GunzipUI implementation of buildUI 
      * @param { ContribWidgets.GaugeOptions | null } barOptions Options for the gauge progress bar to be displayed in the UI
      * @param { Widgets.BoxOptions | null } boxOptions Options for the text box to be displayed in the UI
      * @returns { Status } The current Status of the rendered elements 
      */

    buildUI(barOptions?: ContribWidgets.GaugeOptions | undefined, boxOptions?: Widgets.BoxOptions | undefined): Status {
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
                content: '{center}{red-fg}Extracting ' + '{magenta-fg}' + this.fullFilename + '{/magenta-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Uncompressed: {blue-fg}0 MB{/}\n' + '{center}Speed: {blue-fg}0 KB/s{/}\n' + 'Total: {blue-fg}' + round(this.total / 1000000, 2) + ' MB{/}'
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
   * GunzipUI implementation of updateUI
   * @param { Status } status The current status object to be updated 
   * @param { number } written The amount of bytes written to the uncompressed file 
   * @param { Buffer | string } data The amount of bytes transferred  
   * @param { boolean } isFinished Check if the extraction has finished
   * @returns { void } 
   */

    updateUI(status: Status, written: number, data: string | Buffer, isFinished: boolean): void {
        let bar: ContribWidgets.GaugeElement = status.bar,
            box: Widgets.BoxElement = status.box;

        const writtenMB: number = round(written / 1000000, 2);
        const dataKB: number = round(data.length / 1000, 2);
        const remainingMB: number = round((this.total - written) / 1000000, 2);
        const ETA: string = eta(dataKB, remainingMB);

        box.setContent('{center}{yellow-fg}Extracting{/yellow-fg} ' + '{green-fg}' + this.fullFilename + '{/green-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: ' + '{green-fg}' + ETA + '{/}\n' + '{center}Uncompressed: {blue-fg}' + writtenMB + ' MB{/}\n' + '{center}Speed: {blue-fg}' + dataKB + ' KB/s{/}\n' + 'Total: {blue-fg}' + round(this.total / 1000000, 2) + ' MB{/}' + '\n\n' + (isFinished ? '{center}{green-fg}Done!{/}\n' + '{center}{red-fg}Press Q or Escape to quit{/}' : ''));

        let percent: number;

        if (isFinished) {
            percent = 100;
        } else if (100 * written <= this.total) {
            percent = written / this.total;
        } else {
            percent = (100 * written) / this.total;
        }
        bar.setPercent(percent);
        this.screen.render();
    }
}

export { GunzipUI };