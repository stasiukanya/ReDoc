'use strict';
import { Component, EventEmitter, Input, Output, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ScrollService, MenuService, OptionsService } from '../../services/';
import { PerfectScrollbar } from '../../shared/components';
import { BrowserDomAdapter as DOM } from '../../utils/browser-adapter';
var global = window;
var SideMenuItems = /** @class */ (function () {
    function SideMenuItems() {
        this.activate = new EventEmitter();
    }
    SideMenuItems.prototype.activateItem = function (item) {
        this.activate.next(item);
    };
    SideMenuItems.decorators = [
        { type: Component, args: [{
                    selector: 'side-menu-items',
                    template: '<li *ngFor="let item of items; let idx = index" class="menu-item" ngClass="menu-item-depth-{{item.depth}} {{item.active ? \'active\' : \'\'}} menu-item-for-{{item.metadata?.type}}"><label class="menu-item-header" [ngClass]="{disabled: !item.ready, deprecated: item?.metadata?.deprecated}" (click)="activateItem(item)"><span class="operation-type" [ngClass]="item?.metadata?.operation" *ngIf="item?.metadata?.operation">{{item?.metadata?.operation}} </span><span class="menu-item-title">{{item.name}}</span> <svg *ngIf="item.items?.length" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 24 24" xml:space="preserve"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "/></svg></label><ul *ngIf="item.items" class="menu-subitems"><side-menu-items [items]="item.items" (activate)="activateItem($event)"></side-menu-items></ul></li>',
                    styles: ['.menu-item-header{cursor:pointer;color:rgba(38,50,56,.9);-webkit-transition:all .15s ease-in-out;-moz-transition:all .15s ease-in-out;-ms-transition:all .15s ease-in-out;-o-transition:all .15s ease-in-out;transition:all .15s ease-in-out;margin:0;padding:12.5px 20px;display:flex;justify-content:space-between}.menu-item,.menu-subitems{padding:0;overflow:hidden}.menu-item-depth-0>.menu-item-header>svg,.menu-item-header[hidden]{display:none}.menu-item-header.disabled,.menu-item-header.disabled:hover{cursor:default;color:#bdccd3}.menu-item-header.deprecated{text-decoration:line-through;color:#bdccd3}.menu-item-header>svg{height:18px;vertical-align:middle;float:right;transform:rotateZ(-90deg)}.menu-item-header>svg polygon{fill:#ccc}.active>.menu-item-header>svg{transform:rotateZ(0)}.menu-item{-webkit-transition:all .15s ease-in-out;-moz-transition:all .15s ease-in-out;-ms-transition:all .15s ease-in-out;-o-transition:all .15s ease-in-out;transition:all .15s ease-in-out;list-style:none inside;text-overflow:ellipsis}.menu-subitems{margin:0;font-size:.929em;line-height:1.2em;font-weight:300;color:rgba(38,50,56,.9);height:0}.active>.menu-subitems,.menu-item-depth-0>.menu-subitems{height:auto}.menu-item-depth-1>.menu-item-header{font-family:Montserrat,sans-serif;font-weight:300;font-size:.929em;text-transform:uppercase}.menu-item-depth-1.menu-item-for-operation>.menu-item-header{text-transform:none}.menu-item-depth-1.active>.menu-item-header,.menu-item-depth-1>.menu-item-header:not(.disabled):hover{color:#0033a0;background:#f0f0f0}.menu-item-depth-2>.menu-item-header{padding-left:20px}.menu-item-depth-2.active>.menu-item-header,.menu-item-depth-2>.menu-item-header:hover{background:#e1e1e1}.menu-item-depth-0{margin-top:15px}.menu-item-depth-0>.menu-item-header{font-family:Montserrat,sans-serif;color:rgba(38,50,56,.4);text-transform:uppercase;font-size:.8em;padding-bottom:0;cursor:default}'],
                },] },
    ];
    /** @nocollapse */
    SideMenuItems.ctorParameters = function () { return []; };
    SideMenuItems.propDecorators = {
        'items': [{ type: Input },],
        'activate': [{ type: Output },],
    };
    return SideMenuItems;
}());
export { SideMenuItems };
var SideMenu = /** @class */ (function () {
    function SideMenu(elementRef, scrollService, menuService, optionsService, detectorRef) {
        var _this = this;
        this.scrollService = scrollService;
        this.menuService = menuService;
        this.detectorRef = detectorRef;
        this.$element = elementRef.nativeElement;
        this.activeCatCaption = '';
        this.activeItemCaption = '';
        this.options = optionsService.options;
        this.changedActiveSubscription = this.menuService.changedActiveItem.subscribe(function (evt) { return _this.changed(evt); });
        this.changedSubscription = this.menuService.changed.subscribe(function (evt) {
            _this.update();
        });
    }
    SideMenu.prototype.changed = function (item) {
        if (!item) {
            this.activeCatCaption = '';
            this.activeItemCaption = '';
            return;
        }
        if (item.parent) {
            this.activeItemCaption = item.name;
            this.activeCatCaption = item.parent.name;
        }
        else {
            this.activeCatCaption = item.name;
            this.activeItemCaption = '';
        }
        // safari doesn't update bindings if not run changeDetector manually :(
        this.update();
        this.scrollActiveIntoView();
    };
    SideMenu.prototype.update = function () {
        this.detectorRef.detectChanges();
        this.PS && this.PS.update();
    };
    SideMenu.prototype.scrollActiveIntoView = function () {
        var $item = this.$element.querySelector('li.active, label.active');
        if ($item)
            $item.scrollIntoViewIfNeeded();
    };
    SideMenu.prototype.activateAndScroll = function (item) {
        if (this.mobileMode) {
            this.toggleMobileNav();
        }
        this.menuService.activate(item);
        this.menuService.scrollToActive();
    };
    SideMenu.prototype.init = function () {
        var _this = this;
        this.menuItems = this.menuService.items;
        this.$mobileNav = DOM.querySelector(this.$element, '.mobile-nav');
        this.$resourcesNav = DOM.querySelector(this.$element, '#resources-nav');
        //decorate scrollYOffset to account mobile nav
        this.scrollService.scrollYOffset = function () {
            var mobileNavOffset = _this.$mobileNav.clientHeight;
            return _this.options.scrollYOffset() + mobileNavOffset;
        };
    };
    Object.defineProperty(SideMenu.prototype, "mobileMode", {
        get: function () {
            return this.$mobileNav.clientHeight > 0;
        },
        enumerable: true,
        configurable: true
    });
    SideMenu.prototype.toggleMobileNav = function () {
        var $overflowParent = (this.options.$scrollParent === global) ? DOM.defaultDoc().body
            : this.$scrollParent;
        if (DOM.hasStyle(this.$resourcesNav, 'height')) {
            DOM.removeStyle(this.$resourcesNav, 'height');
            DOM.removeStyle($overflowParent, 'overflow-y');
        }
        else {
            var viewportHeight = this.options.$scrollParent.innerHeight
                || this.options.$scrollParent.clientHeight;
            var height = viewportHeight - this.$mobileNav.getBoundingClientRect().bottom;
            DOM.setStyle($overflowParent, 'overflow-y', 'hidden');
            DOM.setStyle(this.$resourcesNav, 'height', height + 'px');
        }
    };
    SideMenu.prototype.destroy = function () {
        this.changedActiveSubscription.unsubscribe();
        this.changedSubscription.unsubscribe();
        this.scrollService.unbind();
        this.menuService.destroy();
    };
    SideMenu.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    SideMenu.prototype.ngOnInit = function () {
        this.init();
    };
    SideMenu.prototype.ngAfterViewInit = function () {
    };
    SideMenu.decorators = [
        { type: Component, args: [{
                    selector: 'side-menu',
                    template: '<div #mobile class="mobile-nav" (click)="toggleMobileNav()"><span class="selected-item-info"><span class="selected-tag">{{activeCatCaption}} </span><span class="selected-endpoint">{{activeItemCaption}}</span></span></div><ng-template #default><side-menu-items [items]="menuItems" (activate)="activateAndScroll($event)"></side-menu-items></ng-template><div #desktop id="resources-nav" perfect-scrollbar><ul class="menu-root"><div *ngIf="itemsTemplate; else default"><ng-container *ngTemplateOutlet="itemsTemplate; context: this"></ng-container></div></ul></div>',
                    styles: [':host{display:flex;box-sizing:border-box}#resources-nav{position:relative;width:100%;overflow:scroll}ul.menu-root{margin:0;padding:0}.mobile-nav{display:none;height:3em;line-height:3em;box-sizing:border-box;border-bottom:1px solid #ccc;cursor:pointer}.mobile-nav:after{content:"";display:inline-block;width:3em;height:3em;background:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 100 100" version="1.1" viewBox="0 0 100 100" xml:space="preserve"><polygon fill="#010101" points="23.1 34.1 51.5 61.7 80 34.1 81.5 35 51.5 64.1 21.5 35 23.1 34.1 "/></svg>\') center no-repeat;background-size:70%;float:right;vertical-align:middle}@media (max-width:1000px){:host{display:block}.mobile-nav{display:block}#resources-nav{height:0;overflow-y:auto;transition:all .3s ease}.menu-subitems{height:auto}}.selected-tag{text-transform:capitalize}.selected-endpoint:before{content:"/";padding:0 2px;color:#ccc}.selected-endpoint:empty:before{display:none}.selected-item-info{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;box-sizing:border-box;max-width:350px}@media (max-width:550px){.selected-item-info{display:inline-block;padding:0 20px;max-width:80%;max-width:calc(100% - 4em)}}']
                },] },
    ];
    /** @nocollapse */
    SideMenu.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: ScrollService, },
        { type: MenuService, },
        { type: OptionsService, },
        { type: ChangeDetectorRef, },
    ]; };
    SideMenu.propDecorators = {
        'itemsTemplate': [{ type: Input },],
        'PS': [{ type: ViewChild, args: [PerfectScrollbar,] },],
    };
    return SideMenu;
}());
export { SideMenu };
//# sourceMappingURL=side-menu.js.map