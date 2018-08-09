import { OnInit, OnDestroy } from '@angular/core';
import { SpecManager } from '../utils/spec-manager';
import { AppStateService } from '../services/app-state.service';
import { Subscription } from 'rxjs/Subscription';
export { SpecManager };
/**
 * Generic Component
 * @class
 */
export declare class BaseComponent implements OnInit, OnDestroy {
    specMgr: SpecManager;
    pointer: string;
    componentSchema: any;
    dereferencedCache: {};
    constructor(specMgr: SpecManager);
    /**
     * onInit method is run by angular2 after all component inputs are resolved
     */
    ngOnInit(): void;
    preinit(): void;
    ngOnDestroy(): void;
    /**
     * Used to initialize component
     * @abstract
     */
    init(): void;
    /**
     + Used to destroy component
     * @abstract
     */
    destroy(): void;
}
export declare abstract class BaseSearchableComponent extends BaseComponent implements OnDestroy {
    specMgr: SpecManager;
    app: AppStateService;
    searchSubscription: Subscription;
    constructor(specMgr: SpecManager, app: AppStateService);
    subscribeForSearch(): void;
    preinit(): void;
    ngOnDestroy(): void;
    /**
     + Used to destroy component
     * @abstract
     */
    abstract ensureSearchIsShown(ptr: string): any;
}
