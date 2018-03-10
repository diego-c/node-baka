import blessed, { Widgets } from 'blessed'
import { IViewable } from './IViewable';
import { Status } from './Status';

/**
 * Base class to be extended for different types of UI
 */
abstract class UI {
    /**
     * @param { Widgets.Screen } screen The blessed screen instance to be initialized 
     */
    private screen: Widgets.Screen;

    /**
     * Builds the initial UI 
     * @param { string } fullFilename The full filename in the format filename._extension_
     * @param { string } destination The path to store the file
     * @param { number } total The total amount of bytes to be written to the file
     * @returns { Status } The current Status of the rendered elements 
     */

    abstract buildUI(fullFilename: string, destination: string, total: number): Status

    /** 
     * @param { string } fullFilename The filename in the format filename._extension_ 
     * @param { string } destination The path to store the file
     * @param { number } total The total amount of bytes of the file to be transferred
     */
    constructor(fullFilename: string, private destination: string, private total: number) {
        this.screen = blessed.screen({
            smartCSR: true
        });
    }
}

export { UI };