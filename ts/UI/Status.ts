import { Widgets } from 'blessed'
import { Widgets as ContribWidgets } from 'blessed-contrib';

/**
 * Defines the shape of status objects
 * @interface Status
 */
export interface Status {
    bar: ContribWidgets.GaugeElement,
    box: Widgets.BoxElement,
    screen: Widgets.Screen
}