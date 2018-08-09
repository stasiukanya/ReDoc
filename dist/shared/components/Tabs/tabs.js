'use strict';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
var Tabs = /** @class */ (function () {
    function Tabs(changeDetector) {
        this.changeDetector = changeDetector;
        this.change = new EventEmitter();
        this.tabs = [];
    }
    Tabs.prototype.selectTab = function (tab, notify) {
        if (notify === void 0) { notify = true; }
        if (tab.active)
            return;
        this.tabs.forEach(function (tab) {
            tab.active = false;
        });
        tab.active = true;
        if (notify)
            this.change.next(tab.tabTitle);
    };
    Tabs.prototype.selectyByTitle = function (tabTitle, notify) {
        if (notify === void 0) { notify = false; }
        var prevActive;
        var newActive;
        this.tabs.forEach(function (tab) {
            if (tab.active)
                prevActive = tab;
            tab.active = false;
            if (tab.tabTitle === tabTitle) {
                newActive = tab;
            }
        });
        if (newActive) {
            newActive.active = true;
        }
        else {
            prevActive.active = true;
        }
        if (notify)
            this.change.next(tabTitle);
        this.changeDetector.markForCheck();
    };
    Tabs.prototype.addTab = function (tab) {
        if (this.tabs.length === 0) {
            tab.active = true;
        }
        this.tabs.push(tab);
    };
    Tabs.prototype.ngOnInit = function () {
        var _this = this;
        if (this.selected)
            this.selected.subscribe(function (title) { return _this.selectyByTitle(title); });
    };
    Tabs.decorators = [
        { type: Component, args: [{
                    selector: 'tabs',
                    template: '<ul><li *ngFor="let tab of tabs" [ngClass]="{active: tab.active}" (click)="selectTab(tab)" class="tab-{{tab.tabStatus}}" [innerHtml]="tab.tabTitle | safe"></li></ul><ng-content></ng-content>',
                    styles: [':host{display:block}ul{display:block;margin:0;padding:0}li{list-style:none;display:inline-block;cursor:pointer}li /deep/ .redoc-markdown-block p{display:inline}.tab-error:before,.tab-info:before,.tab-redirect:before,.tab-success:before{content:"";display:inline-block;position:relative;top:-2px;height:4px;width:4px;border-radius:50%;margin-right:.5em}.tab-success:before{box-shadow:0 0 3px 0 #00aa13;background-color:#00aa13}.tab-error:before{box-shadow:0 0 3px 0 #e53935;background-color:#e53935}.tab-redirect:before{box-shadow:0 0 3px 0 #f1c400;background-color:#f1c400}.tab-info:before{box-shadow:0 0 3px 0 #0033a0;background-color:#0033a0}'],
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    Tabs.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
    ]; };
    Tabs.propDecorators = {
        'selected': [{ type: Input },],
        'change': [{ type: Output },],
    };
    return Tabs;
}());
export { Tabs };
var Tab = /** @class */ (function () {
    function Tab(tabs) {
        this.active = false;
        tabs.addTab(this);
    }
    Tab.decorators = [
        { type: Component, args: [{
                    selector: 'tab',
                    template: '<div class="tab-wrap" [ngClass]="{\'active\': active}"><ng-content></ng-content></div>',
                    styles: [':host{display:block}.tab-wrap{display:none}.tab-wrap.active{display:block}']
                },] },
    ];
    /** @nocollapse */
    Tab.ctorParameters = function () { return [
        { type: Tabs, },
    ]; };
    Tab.propDecorators = {
        'active': [{ type: Input },],
        'tabTitle': [{ type: Input },],
        'tabStatus': [{ type: Input },],
    };
    return Tab;
}());
export { Tab };
//# sourceMappingURL=tabs.js.map