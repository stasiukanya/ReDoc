import { QueryList, OnInit, ElementRef, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BaseComponent, SpecManager } from '../base';
import { Tabs } from '../../shared/components/index';
import { AppStateService, ScrollService } from '../../services/index';
export declare class RequestSamples extends BaseComponent implements OnInit {
    appState: AppStateService;
    private scrollService;
    private el;
    private zone;
    pointer: string;
    schemaPointer: string;
    childQuery: QueryList<Tabs>;
    hidden: any;
    childTabs: Tabs;
    selectedLang: Subject<any>;
    samples: Array<any>;
    constructor(specMgr: SpecManager, appState: AppStateService, scrollService: ScrollService, el: ElementRef, zone: NgZone);
    changeLangNotify(lang: any): void;
    init(): void;
    ngOnInit(): void;
}
