import { OnInit } from '@angular/core';
import { SpecManager, BaseComponent } from '../base';
export declare class SecurityDefinitions extends BaseComponent implements OnInit {
    info: any;
    specUrl: String;
    defs: any[];
    static insertTagIntoDescription(md: string): string;
    constructor(specMgr: SpecManager);
    init(): void;
    ngOnInit(): void;
}
