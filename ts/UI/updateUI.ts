import { Status } from "./Status";
import { Widgets } from "blessed";
import { Widgets as ContribWidgets } from 'blessed-contrib';
import { round } from "../utils/round";
import { getSpeed } from '../utils/getSpeed';
import { eta } from "../utils/eta";

const updateUI = (status: Status, fullFilename: string, destination: string, written: number, data: (Buffer | string), total: number, isFinished: boolean): void => {

    const box: Widgets.BoxElement = status.box;
    const bar: ContribWidgets.GaugeElement = status.bar;
    const screen: Widgets.Screen = status.screen;

    const downloaded: number = round(written / 1000000, 2);

    const totalInMB: number = round(total / 1000000, 2);

    const remaining: number = round(totalInMB - downloaded, 2);

    const connectionSpeed: number = round(getSpeed(data.length) / 1000, 2)

    let estimated: string;

    estimated = eta(connectionSpeed, remaining);


    box.setContent(
        '{center}{red-fg}Downloading ' + '{green-fg}' + fullFilename + '{/green-fg}' + ' to {magenta-fg}' + destination + '{/}\n\n' + '{center}ETA: {#08a573-fg}' + estimated + '{/}\n' + '{center}Speed: {blue-fg} ' + connectionSpeed + ' KB/s{/}\n' + '{center}Downloaded: {blue-fg}' + downloaded + ' MB{/}\n' + '{center}Remaining: {blue-fg}' + remaining + ' MB{/}\n' + '{center}Total: {blue-fg}' + totalInMB + ' MB{/}\n' + (isFinished ? '\n{center}{green-fg}Download finished!{/}\n{center}Press Q or Escape to exit{/}' : ''
        ));

    bar.setPercent(100 * downloaded / totalInMB);

    screen.render();
}

export { updateUI };