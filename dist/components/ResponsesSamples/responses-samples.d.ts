import { OnInit } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
export declare class ResponsesSamples extends BaseComponent implements OnInit {
    pointer: string;
    data: any;
    constructor(specMgr: SpecManager);
    init(): void;
    ngOnInit(): void;
}
