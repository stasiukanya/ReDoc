import { EventEmitter, OnChanges } from '@angular/core';
export declare class Zippy implements OnChanges {
    type: string;
    empty: boolean;
    title: any;
    headless: boolean;
    open: boolean;
    openChange: EventEmitter<{}>;
    toggle(): void;
    ngOnChanges(ch: any): void;
}
