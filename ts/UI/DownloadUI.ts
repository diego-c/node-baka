import { UI } from "./UI";
import { Status } from "./Status";
import blessed, { Widgets } from "blessed";
import contrib, { Widgets as ContribWidgets } from 'blessed-contrib';
import { round } from "../utils/round";
import speed from 'speedometer';

class DownloadUI extends UI {

    constructor(fullFilename: string, destination: string, total: number) {
        super(fullFilename, destination, total);
    }

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
                content: '{center}{red-fg}Downloading ' + '{magenta-fg}' + this.fullFilename + '{/magenta-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Speed: {blue-fg}0 KB/s{/}\n' + '{center}Downloaded: {blue-fg}0 MB{/}\n' + 'Remaining: {blue-fg}' + (this.total / 1000000) + ' MB{/}'
            }
        }

        const grid: ContribWidgets.GridElement = new contrib.grid({
            rows: 12,
            cols: 12,
            screen: this.screen
        });

        const bar: ContribWidgets.GaugeElement = grid.set(8, 0, 4, 12, contrib.gauge, barOptions);
        const box: Widgets.BoxElement = grid.set(0, 0, 8, 12, blessed.box, boxOptions);

        this.screen.key(['escape', 'q'], (ch, key) => {
            return process.exit(0);
        });

        bar.setPercent(0);
        this.screen.render();

        return { bar, box, screen: this.screen };
    }

    updateUI(status: Status, written: number, data: (Buffer | string), isFinished: boolean): void {

        const downloaded: (number | string) = Number.isNaN(round(written / 1000000, 2)) ?
            'Unknown' :
            round(written / 1000000, 2);

        const remaining: (number | string) =
            Number.isNaN(round((this.total - written) / 1000000, 2)) ?
                'Unknown' :
                round((this.total - written) / 1000000, 2)

        const connectionSpeed: (number | string) =
            Number.isNaN(round(speed(data.length ? data.length : data) / 1000, 2)) ?
                'Unknown' :
                round(speed(data.length) / 1000, 2)

        let estimated: string;

        if (typeof connectionSpeed === 'string' || typeof remaining === 'string') {
            estimated = 'Unknown';
        } else {
            estimated = eta(connectionSpeed, remaining);
        }

        const box: Widgets.BoxElement = status.box;
        const bar: ContribWidgets.GaugeElement = status.bar;
        const screen: Widgets.Screen = status.screen;

        box.setContent(
            '{center}{red-fg}Downloading ' + '{green-fg}' + this.fullFilename + '{/green-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: {#08a573-fg}' + estimated + '{/}\n' + '{center}Speed: {blue-fg} ' + connectionSpeed + ' KB/s{/}\n' + '{center}Downloaded: {blue-fg}' + downloaded + ' MB{/}\n' + '{center}Remaining: {blue-fg}' + remaining + ' MB{/}\n' + (isFinished ? '\n{center}{green-fg}Download finished!{/}\n{center}Press Q or Escape to exit{/}' : ''
            ));

        const totalInMB: number = round((this.total / 1000000), 2);

        if (typeof downloaded === 'number') {
            bar.setPercent((100 * downloaded) / totalInMB);
        }

        screen.render();
    }
}

export { DownloadUI };