'use strict';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Marker, SearchService, MenuService } from '../../services/';
import { throttle } from '../../utils/';
var RedocSearch = /** @class */ (function () {
    function RedocSearch(cdr, marker, search, menu) {
        var _this = this;
        this.marker = marker;
        this.search = search;
        this.menu = menu;
        this.logo = {};
        this.items = [];
        this.searchTerm = '';
        this._subscription = menu.changed.subscribe(function () {
            cdr.markForCheck();
            cdr.detectChanges();
        });
        this.throttledSearch = throttle(function () {
            _this.updateSearch();
            cdr.markForCheck();
            cdr.detectChanges();
        }, 300, this);
    }
    RedocSearch.prototype.init = function () {
        this.search.indexAll();
    };
    RedocSearch.prototype.clearSearch = function () {
        this.searchTerm = '';
        this.updateSearch();
    };
    RedocSearch.prototype.update = function (event, val) {
        if (event && event.keyCode === 27) {
            this.searchTerm = '';
        }
        else {
            this.searchTerm = val;
        }
        this.throttledSearch();
    };
    RedocSearch.prototype.updateSearch = function () {
        var _this = this;
        if (!this.searchTerm || this.searchTerm.length < 2) {
            this.items = [];
            this.marker.unmark();
            return;
        }
        var searchRes = this.search.search(this.searchTerm);
        this.items = Object.keys(searchRes).map(function (id) { return ({
            menuItem: _this.menu.getItemById(id),
            pointers: searchRes[id].map(function (el) { return el.pointer; })
        }); }).filter(function (res) { return !!res.menuItem; });
        this.items.sort(function (a, b) {
            if (a.menuItem.depth > b.menuItem.depth)
                return 1;
            else if (a.menuItem.depth < b.menuItem.depth)
                return -1;
            else
                return 0;
        });
        this.marker.mark(this.searchTerm);
    };
    RedocSearch.prototype.clickSearch = function (item) {
        this.search.ensureSearchVisible(item.pointers);
        this.marker.remark();
        this.menu.activate(item.menuItem);
        this.menu.scrollToActive();
    };
    RedocSearch.prototype.ngOnInit = function () {
        this.init();
    };
    RedocSearch.prototype.destroy = function () {
        this._subscription.unsubscribe();
    };
    RedocSearch.decorators = [
        { type: Component, args: [{
                    selector: 'redoc-search',
                    styles: [':host{display:block;margin:10px 0}.search-input-wrap{padding:0 20px}.search-input-wrap>svg{width:13px;height:27px;display:inline-block;position:absolute}.search-input-wrap>svg path{fill:#4f6875}.search-input-wrap .clear-button{position:absolute;display:inline-block;width:13px;text-align:center;right:20px;height:28px;line-height:28px;vertical-align:middle;cursor:pointer}input{width:100%;box-sizing:border-box;padding:5px 20px;border:0;border-bottom:1px solid #e1e1e1;font-weight:700;font-size:13px;color:#263238;background-color:transparent;outline:0}.search-results{margin:10px 0 0;list-style:none;padding:10px 0;background-color:#ededed;overflow-y:auto;border-bottom:1px solid #e1e1e1;border-top:1px solid #e1e1e1;line-height:1.2;min-height:150px;max-height:250px}.search-results>li{display:block;cursor:pointer;font-family:Montserrat,sans-serif;font-size:13px;padding:5px 20px}.search-results>li:hover{background-color:#e1e1e1}.search-results li.menu-item-depth-1{color:#0033a0;text-transform:uppercase}.search-results>li.disabled{cursor:default;color:#bdccd3}'],
                    template: '<div class="search-input-wrap"><div class="clear-button" *ngIf="searchTerm" (click)="clearSearch()">×</div><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><path d="M968.2,849.4L667.3,549c83.9-136.5,66.7-317.4-51.7-435.6C477.1-25,252.5-25,113.9,113.4c-138.5,138.3-138.5,362.6,0,501C219.2,730.1,413.2,743,547.6,666.5l301.9,301.4c43.6,43.6,76.9,14.9,104.2-12.4C981,928.3,1011.8,893,968.2,849.4z M524.5,522c-88.9,88.7-233,88.7-321.8,0c-88.9-88.7-88.9-232.6,0-321.3c88.9-88.7,233-88.7,321.8,0C613.4,289.4,613.4,433.3,524.5,522z"/></svg> <input #search (keyup)="update($event, search.value)" [value]="searchTerm" placeholder="Search"></div><ul class="search-results" [hidden]="!items.length"><li class="result menu-item-header" *ngFor="let item of items" ngClass="menu-item-depth-{{item.menuItem.depth}} {{item.menuItem.ready ? \'\' : \'disabled\'}}" (click)="clickSearch(item)"><span class="operation-type" [ngClass]="item.menuItem?.metadata?.operation" *ngIf="item.menuItem?.metadata?.operation">{{item.menuItem?.metadata?.operation}} </span><span class="menu-item-title">{{item.menuItem.name}}</span></li></ul>',
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    RedocSearch.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
        { type: Marker, },
        { type: SearchService, },
        { type: MenuService, },
    ]; };
    return RedocSearch;
}());
export { RedocSearch };
//# sourceMappingURL=redoc-search.js.map