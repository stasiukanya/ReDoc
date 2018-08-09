import { OnInit } from '@angular/core';
import { SpecManager, BaseComponent } from '../base';
import { OptionsService } from '../../services/index';
export declare class Warnings extends BaseComponent implements OnInit {
    warnings: Array<string>;
    shown: boolean;
    suppressWarnings: boolean;
    constructor(specMgr: SpecManager, optionsMgr: OptionsService);
    init(): void;
    close(): void;
    ngOnInit(): void;
}
