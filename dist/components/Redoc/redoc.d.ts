import { ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { BaseComponent } from '../base';
import { SpecManager } from '../../utils/spec-manager';
import { OptionsService, Options, Hash, AppStateService } from '../../services/';
import { LazyTasksService } from '../../shared/components/LazyFor/lazy-for';
export declare class Redoc extends BaseComponent implements OnInit {
    private changeDetector;
    private appState;
    private lazyTasksService;
    private hash;
    static _preOptions: any;
    error: any;
    specLoaded: boolean;
    options: Options;
    loadingProgress: number;
    specUrl: string;
    specLoading: boolean;
    specLoadingRemove: boolean;
    private element;
    private $parent;
    private $refElem;
    constructor(specMgr: SpecManager, optionsMgr: OptionsService, elementRef: ElementRef, changeDetector: ChangeDetectorRef, appState: AppStateService, lazyTasksService: LazyTasksService, hash: Hash);
    hideLoadingAnimation(): void;
    showLoadingAnimation(): void;
    load(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
