import { Widgets } from 'blessed'
import { Widgets as ContribWidgets } from 'blessed-contrib';

export interface Status {
    bar: ContribWidgets.GaugeElement,
    box: Widgets.BoxElement,
    screen: Widgets.Screen
}