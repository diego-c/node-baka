import blessed, { Widgets } from 'blessed';
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

    /**
     * Updates the UI information
     * @param { Status } status The current status object to be updated 
     * @param { number } written The amount of bytes written to the file 
     * @param { Buffer | string } data The amount of bytes transferred  
     * @param { boolean } isFinished Check if the download has finished
     * @returns { void } 
     */
    abstract updateUI(status: Status, written: number, data: (Buffer | string), isFinished: boolean): void;

    /**
     * Error handler UI
     * @param { Error } error The error object containing a message
     * @param { Status | undefined } status The current status object
     * @param { number | undefined } written The amount of bytes written to the file
     * @param { Buffer | string | undefined } data The amount of bytes transferred
     * @returns { void }
     */

    abstract errorUI(error: Error, status?: Status, written?: number, data?: (Buffer | string)): void;

    /** 
     * Base constructor to be extended for UIs
     * @param { string } fullFilename The filename in the format filename._extension_ 
     * @param { string } destination The path to store the file
     * @param { number } total The total amount of bytes of the file to be transferred
     */
    protected constructor(fullFilename: string, destination: string, total: number) {
        this._screen = blessed.screen({
            smartCSR: true
        });
        this._fullFilename = fullFilename;
        this._destination = destination;
        this._total = total;
    }

    /**
     * Getter for screen
     * @returns { Widgets.Screen }
     */
    get screen(): Widgets.Screen {
        return this._screen;
    }

    /**
     * Getter for fullFilename
     * @returns { string }
     */
    get fullFilename(): string {
        return this._fullFilename;
    }

    /**
     * Getter for destination
     * @returns { string }
     */

    get destination(): string {
        return this._destination;
    }

    /**
     * Getter for the total amount of bytes
     * @returns { number }
     */

    get total(): number {
        return this._total;
    }
}

export { UI };