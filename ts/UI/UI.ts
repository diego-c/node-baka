import blessed, { Widgets } from 'blessed'

abstract class UI {
    private screen: Widgets.Screen;

    constructor(fullFilename: string, private destination: string, private total: number) {
        this.screen = blessed.screen({
            smartCSR: true
        });
    }
}