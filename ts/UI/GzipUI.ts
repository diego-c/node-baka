import { UI } from './UI';
import { Status } from './Status';
import contrib, { Widgets as ContribWidgets } from 'blessed-contrib';
import blessed, { Widgets } from 'blessed';
import { round } from '../utils/round';

class GzipUI extends UI {

    constructor(fullFilename: string, destination: string, total: number) {
        super(fullFilename, destination, total);
    }

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
                content: '{center}{red-fg}Compressing ' + '{magenta-fg}' + this.fullFilename + '{/magenta-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Written: {blue-fg}0 MB{/}\n' + '{center}Data length: {blue-fg}0 MB{/}\n' + 'Total: {blue-fg}' + round(this.total / 1000000, 2) + ' MB{/}'
            }
        }

        const grid = new contrib.grid({
            rows: 12,
            cols: 12,
            screen: this.screen
        });

        const bar = grid.set(8, 0, 4, 12, contrib.gauge, barOptions);

        const box = grid.set(0, 0, 8, 12, blessed.box, boxOptions);

        this.screen.key(['escape', 'q'], (ch, key) => {
            return process.exit(0);
        });

        bar.setPercent(0);
        this.screen.render();
        return { bar, box, screen: this.screen };
    }

    updateUI(status: Status, written: number, data: string | Buffer, isFinished: boolean): void {
        let bar: ContribWidgets.GaugeElement = status.bar,
            box: Widgets.BoxElement = status.box;

        const writtenMB: number = round(written / 1000000, 2);
        const dataMB: number = round(data.length / 1000000, 2);

        box.setContent('{center}{yellow-fg}Compressing{/yellow-fg} ' + '{green-fg}' + this.fullFilename + '{/green-fg}' + ' to {magenta-fg}' + this.destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Written: {blue-fg}' + writtenMB + ' MB{/}\n' + '{center}Data length: {blue-fg}' + dataMB + ' MB{/}\n' + 'Total: {blue-fg}' + round(this.total / 1000000, 2) + ' MB{/}');

        let percent: number;

        if (100 * written <= this.total) {
            percent = written / this.total;
        } else {
            percent = (100 * written) / this.total;
        }
        bar.setPercent(percent);
        this.screen.render();
    }
}

export { GzipUI };