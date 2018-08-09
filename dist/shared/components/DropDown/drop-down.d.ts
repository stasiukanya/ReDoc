import { EventEmitter, ElementRef, AfterContentInit, OnChanges } from '@angular/core';
export declare class DropDown implements AfterContentInit, OnChanges {
    change: EventEmitter<{}>;
    active: string;
    elem: any;
    inst: any;
    constructor(elem: ElementRef);
    ngAfterContentInit(): void;
    onChange(value: any): void;
    ngOnChanges(ch: any): void;
    destroy(): void;
}
