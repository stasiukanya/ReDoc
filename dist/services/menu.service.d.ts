import { EventEmitter } from '@angular/core';
import { ScrollService } from './scroll.service';
import { Hash } from './hash.service';
import { SpecManager } from '../utils/spec-manager';
import { AppStateService } from './app-state.service';
import { LazyTasksService } from '../shared/components/LazyFor/lazy-for';
import { MarkdownHeading } from '../utils/';
export interface TagGroup {
    name: string;
    tags: string[];
}
export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    items?: Array<MenuItem>;
    parent?: MenuItem;
    active?: boolean;
    ready?: boolean;
    depth?: string | number;
    flatIdx?: number;
    metadata?: any;
    isGroup?: boolean;
}
export declare class MenuService {
    private hash;
    private tasks;
    private scrollService;
    private appState;
    private specMgr;
    changed: EventEmitter<any>;
    changedActiveItem: EventEmitter<any>;
    items: MenuItem[];
    activeIdx: number;
    domRoot: Document | Element;
    private _flatItems;
    private _hashSubscription;
    private _scrollSubscription;
    private _progressSubscription;
    private _tagsWithOperations;
    constructor(hash: Hash, tasks: LazyTasksService, scrollService: ScrollService, appState: AppStateService, specMgr: SpecManager);
    subscribe(): void;
    readonly flatItems: MenuItem[];
    enableItem(idx: any): void;
    makeSureLastItemsEnabled(): void;
    onScroll(isScrolledDown: any): void;
    onHashChange(hash?: string): void;
    getEl(flatIdx: number): Element;
    isTagOrGroupItem(flatIdx: number): boolean;
    getTagInfoEl(flatIdx: number): Element;
    getCurrentEl(): Element;
    deactivate(idx: any): void;
    activate(item: MenuItem, force?: boolean, replaceState?: boolean): void;
    activateByIdx(idx: number, force?: boolean, replaceState?: boolean): void;
    changeActive(offset?: number): boolean;
    scrollToActive(): void;
    activateByHash(hash: any): boolean;
    tryScrollToId(id: any): void;
    addMarkdownItems(): void;
    getMarkdownSubheaders(parent: MenuItem, parentHeading: MarkdownHeading): MenuItem[];
    getOperationsItems(parent: MenuItem, tag: any): MenuItem[];
    hashFor(id: string | null, itemMeta: {
        operationId?: string;
        type: string;
        pointer?: string;
    }, parentId?: string): string;
    getTagsItems(parent: MenuItem, tagGroup?: TagGroup): MenuItem[];
    getTagGroupsItems(parent: MenuItem, groups: TagGroup[]): MenuItem[];
    checkAllTagsUsedInGroups(): void;
    buildMenu(): void;
    flatMenu(): MenuItem[];
    getItemById(id: string): MenuItem;
    destroy(): void;
}
