import { OnInit } from '@angular/core';
import { OptionsService } from '../../services/options.service';
import { BaseComponent, SpecManager } from '../base';
export declare class ParamsList extends BaseComponent implements OnInit {
    private options;
    pointer: string;
    params: Array<any>;
    empty: boolean;
    bodyParam: any;
    constructor(specMgr: SpecManager, options: OptionsService);
    init(): void;
    orderParams(params: any): any;
    ngOnInit(): void;
}
