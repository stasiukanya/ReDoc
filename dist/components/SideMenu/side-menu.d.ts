import { EventEmitter, ElementRef, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { ScrollService, MenuService, OptionsService, MenuItem } from '../../services/';
import { PerfectScrollbar } from '../../shared/components';
export declare class SideMenuItems {
    items: MenuItem[];
    activate: EventEmitter<MenuItem>;
    activateItem(item: any): void;
}
export declare class SideMenu implements OnInit, OnDestroy {
    private scrollService;
    private menuService;
    private detectorRef;
    activeCatCaption: string;
    activeItemCaption: string;
    menuItems: Array<MenuItem>;
    itemsTemplate: any;
    PS: PerfectScrollbar;
    private options;
    private $element;
    private $mobileNav;
    private $resourcesNav;
    private $scrollParent;
    private changedActiveSubscription;
    private changedSubscription;
    constructor(elementRef: ElementRef, scrollService: ScrollService, menuService: MenuService, optionsService: OptionsService, detectorRef: ChangeDetectorRef);
    changed(item: any): void;
    update(): void;
    scrollActiveIntoView(): void;
    activateAndScroll(item: any): void;
    init(): void;
    readonly mobileMode: boolean;
    toggleMobileNav(): void;
    destroy(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
