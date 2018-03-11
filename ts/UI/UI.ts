import blessed, { Widgets, widget } from 'blessed';
import { Status } from './Status';
import { Widgets as ContribWidgets } from 'blessed-contrib';

/**
 * Base class to be extended for different types of UI
 */
abstract class UI {
    /**
     * @param { Widgets.Screen } screen The blessed screen instance to be initialized 
     */
    private _screen: Widgets.Screen;
    private _fullFilename: string;
    private _destination: string;
    private _total: number;

    /**
     * Builds the initial UI 
     * @param { ContribWidgets.GaugeOptions | null } barOptions Options for the gauge progress bar to be displayed in the UI
     * @param { Widgets.BoxOptions | null } boxOptions Options for the text box to be displayed in the UI
     * @returns { Status } The current Status of the rendered elements 
     */

    abstract buildUI(barOptions?: ContribWidgets.GaugeOptions, boxOptions?: Widgets.BoxOptions): Status;
    abstract updateUI(status: Status, written: number, data: (Buffer | string), isFinished: boolean): void;

    /** 
     * @param { string } _fullFilename The filename in the format filename._extension_ 
     * @param { string } _destination The path to store the file
     * @param { number } _total The total amount of bytes of the file to be transferred
     */
    constructor(fullFilename: string, destination: string, total: number) {
        this._screen = blessed.screen({
            smartCSR: true
        });
        this._fullFilename = fullFilename;
        this._destination = destination;
        this._total = total;
    }

    get screen(): Widgets.Screen {
        return this._screen;
    }

    get fullFilename(): string {
        return this._fullFilename;
    }

    get destination(): string {
        return this._destination;
    }

    get total(): number {
        return this._total;
    }
}

export { UI };