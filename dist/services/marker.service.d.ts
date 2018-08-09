import { MenuService } from './menu.service';
export declare class Marker {
    private menu;
    permInstances: any[];
    rolledInstances: any[];
    term: string;
    currIdx: number;
    constructor(menu: MenuService);
    addElement(el: Element): void;
    newMarkerAtMenuItem(idx: number): any;
    roll(): void;
    mark(term: string): void;
    remark(): void;
    unmark(): void;
}
