import { Status } from "./Status";

export interface IViewable {
    buildUI(fullFilename: string, destination: string, total: number): Status
}