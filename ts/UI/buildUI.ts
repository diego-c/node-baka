import blessed, { Widgets } from 'blessed';
import contrib, { Widgets as ContribWidgets } from 'blessed-contrib';
import { Status } from './Status';

const buildUI = (fullFilename: string, destination: string, total: number, barOptions?: ContribWidgets.GaugeOptions, boxOptions?: Widgets.BoxOptions): Status => {

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
            content: '{center}{red-fg}Downloading ' + '{magenta-fg}' + fullFilename + '{/magenta-fg}' + ' to {magenta-fg}' + destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Speed: {blue-fg}0 KB/s{/}\n' + '{center}Downloaded: {blue-fg}0 MB{/}\n' + 'Remaining: {blue-fg}' + (total / 1000000) + ' MB{/}'
        }
    }

    const screen: Widgets.Screen = blessed.screen({
        smartCSR: true
    });

    const grid: ContribWidgets.GridElement = new contrib.grid({
        rows: 12,
        cols: 12,
        screen
    });

    const bar: ContribWidgets.GaugeElement = grid.set(8, 0, 4, 12, contrib.gauge, barOptions);
    const box: Widgets.BoxElement = grid.set(0, 0, 8, 12, blessed.box, boxOptions);

    screen.key(['escape', 'q'], (ch, key) => {
        return process.exit(0);
    });

    bar.setPercent(0);
    screen.render();

    return { bar, box, screen };
}

export { buildUI };