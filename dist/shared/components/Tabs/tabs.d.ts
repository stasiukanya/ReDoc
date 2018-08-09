import { EventEmitter, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
export declare class Tabs implements OnInit {
    private changeDetector;
    selected: any;
    change: EventEmitter<{}>;
    tabs: Tab[];
    constructor(changeDetector: ChangeDetectorRef);
    selectTab(tab: any, notify?: boolean): void;
    selectyByTitle(tabTitle: any, notify?: boolean): void;
    addTab(tab: any): void;
    ngOnInit(): void;
}
export declare class Tab {
    active: boolean;
    tabTitle: string;
    tabStatus: string;
    constructor(tabs: Tabs);
}
