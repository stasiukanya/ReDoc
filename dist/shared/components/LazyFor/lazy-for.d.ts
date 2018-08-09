import { TemplateRef, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ScrollService } from '../../../services/scroll.service';
import { OptionsService } from '../../../services/options.service';
export declare class LazyForRow {
    $implicit: any;
    index: number;
    ready: boolean;
    constructor($implicit: any, index: number, ready: boolean);
    readonly first: boolean;
    readonly even: boolean;
    readonly odd: boolean;
}
export declare class LazyTasksService {
    optionsService: OptionsService;
    private _tasks;
    private _current;
    private _syncCount;
    private _emptyProcessed;
    private menuService;
    loadProgress: BehaviorSubject<number>;
    allSync: boolean;
    constructor(optionsService: OptionsService);
    readonly processed: boolean;
    syncCount: number;
    lazy: boolean;
    addTasks(tasks: any[], callback: Function): void;
    nextTaskSync(): void;
    nextTask(): void;
    sortTasks(center: any): void;
    start(idx: any, menuService: any): void;
}
export declare class LazyTasksServiceSync extends LazyTasksService {
    constructor(optionsService: OptionsService);
}
export declare class LazyFor {
    _template: TemplateRef<LazyForRow>;
    cdr: ChangeDetectorRef;
    _viewContainer: ViewContainerRef;
    lazyTasks: LazyTasksService;
    scroll: ScrollService;
    lazyForOf: any;
    prevIdx: any;
    constructor(_template: TemplateRef<LazyForRow>, cdr: ChangeDetectorRef, _viewContainer: ViewContainerRef, lazyTasks: LazyTasksService, scroll: ScrollService);
    nextIteration(idx: number, sync: boolean): Promise<void>;
    ngOnInit(): void;
}
