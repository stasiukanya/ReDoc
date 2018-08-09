import { OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseSearchableComponent, SpecManager } from '../base';
import { OptionsService, AppStateService } from '../../services/index';
export declare class ResponsesList extends BaseSearchableComponent implements OnInit {
    private cdr;
    pointer: string;
    responses: Array<any>;
    options: any;
    constructor(specMgr: SpecManager, optionsMgr: OptionsService, app: AppStateService, cdr: ChangeDetectorRef);
    init(): void;
    trackByCode(_: any, el: any): any;
    ensureSearchIsShown(ptr: string): void;
    ngOnInit(): void;
}
