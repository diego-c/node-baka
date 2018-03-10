import blessed, { Widgets } from 'blessed';
import { Widgets as ContribWidgets } from 'blessed-contrib';
import contrib from 'blessed-contrib';
import { round } from './round';
import { eta } from './eta';
import { getSpeed } from './getSpeed';

/**
 * Updates the current status of the file transfer to stdout
 * @param { ContribWidgets.GaugeElement } bar The progress bar to be updated
 * @param { Widgets.BoxElement } box The BoxElement to be updated
 * @param { Widgets.Screen } screen The Screen to be rendered
 * @param { string } fullFilename The name of the file to be downloaded in the format file._extension_
 * @param { string } destination The path to store the file
 * @param { number } written The current amount of bytes written to the file
 * @param { number } total The total amount of bytes to be written to the file
 * @param { number } data The data payload (in bytes) transferred
 * @param { boolean } isFinished Check if the file has finished downloading
 * @returns { void } The formatted message to be logged
 * 
 */

const updateUI = (bar: ContribWidgets.GaugeElement, box: Widgets.BoxElement, screen: Widgets.Screen, fullFilename: string, destination: string, written: number, total: number, data: (Buffer | string), isFinished: boolean) => {

    let downloaded: (string | number), remaining: (string | number), totalInMB: number = round(total / 1000000, 2);

    if (Number.isNaN(written)) {
        downloaded = 'Unknown';
        remaining = 'Unknown';
    } else {
        downloaded = round((written / 1000000), 2);
        remaining = round((total - written) / 1000000, 2);
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

    box.setContent('{center}{red-fg}Downloading ' + '{green-fg}' + fullFilename + '{/green-fg}' + ' to {magenta-fg}' + destination + '{/}\n\n' + '{center}ETA: {#08a573-fg}' + estimated + '{/}\n' + '{center}Speed: {blue-fg} ' + speed + ' KB/s{/}\n' + '{center}Downloaded: {blue-fg}' + downloaded + ' MB{/}\n' + '{center}Remaining: {blue-fg}' + remaining + ' MB{/}\n' + (isFinished ? '\n{center}{green-fg}Download finished!{/}\n{center}Press Q or Escape to exit{/}' : ''));

    // TODO: fix bar % when going from 0 MB to the total / 100 (MB)
    let percent: number;
    if (typeof downloaded === 'number') {
        percent = downloaded < (totalInMB / 100) ? round(downloaded / totalInMB, 2) : round(downloaded * 100 / totalInMB, 2);
    } else {
        percent = 0;
    }
    bar.setPercent(percent);

    screen.render();
}

/**
 * The current status of the UI
 * @typedef { Object } Status
 * @property { Widgets.BoxElement } box The current box element
 * @property { Widgets.Screen } screen The current screen to be rendered
 */
/**
 * Builds the initial UI 
 * @param { string } fullFilename The full filename in the format filename._extension_
 * @param { string } destination The path to store the file
 * @param { number } total The total amount of bytes to be written to the file
 * @returns { Status } The BoxElement and Screen widgets rendered 
 */

const buildUI = (fullFilename, destination, total) => {
    const screen = blessed.screen({
        smartCSR: true
    });

    const grid = new contrib.grid({
        rows: 12,
        cols: 12,
        screen
    });

    const bar = grid.set(8, 0, 4, 12, contrib.gauge, {
        tags: true,
        label: '{bold}{#eae54f-fg}Progress{/}',
        percent: 0,
        stroke: 'green',
        fill: 'black'
    })
    const box = grid.set(0, 0, 8, 12, blessed.box,
        {
            tags: true,
            content: '{center}{red-fg}Downloading ' + '{magenta-fg}' + fullFilename + '{/magenta-fg}' + ' to {magenta-fg}' + destination + '{/}\n\n' + '{center}ETA: 00:00:00{/}\n' + '{center}Speed: {blue-fg}0 KB/s{/}\n' + '{center}Downloaded: {blue-fg}0 MB{/}\n' + 'Remaining: {blue-fg}' + 'Total size' + round(total / 1000000, 2) + ' MB{/}'
        });

    screen.key(['escape', 'q'], (ch, key) => {
        return process.exit(0);
    });

    bar.setPercent(0);
    screen.render();
    return { bar, box, screen };
}

export { buildUI, updateUI };