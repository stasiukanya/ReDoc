import { ElementRef, OnInit } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
export declare class SchemaSample extends BaseComponent implements OnInit {
    pointer: string;
    skipReadOnly: boolean;
    element: any;
    sample: any;
    xmlSample: string;
    textSample: string;
    enableButtons: boolean;
    private _normalizer;
    constructor(specMgr: SpecManager, elementRef: ElementRef);
    init(): void;
    initButtons(): void;
    cache(sample: any): void;
    fromCache(): boolean;
    bindEvents(): void;
    expandAll(): void;
    collapseAll(): void;
    ngOnInit(): void;
}
