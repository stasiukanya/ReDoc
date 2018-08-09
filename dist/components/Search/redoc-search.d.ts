import { ChangeDetectorRef, OnInit } from '@angular/core';
import { Marker, SearchService, MenuService, MenuItem } from '../../services/';
export declare class RedocSearch implements OnInit {
    private marker;
    search: SearchService;
    menu: MenuService;
    logo: any;
    items: {
        menuItem: MenuItem;
        pointers: string[];
    }[];
    searchTerm: string;
    throttledSearch: Function;
    _subscription: any;
    constructor(cdr: ChangeDetectorRef, marker: Marker, search: SearchService, menu: MenuService);
    init(): void;
    clearSearch(): void;
    update(event: KeyboardEvent, val: any): void;
    updateSearch(): void;
    clickSearch(item: any): void;
    ngOnInit(): void;
    destroy(): void;
}
