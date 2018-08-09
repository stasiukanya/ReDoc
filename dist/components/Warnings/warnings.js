'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Component } from '@angular/core';
import { SpecManager, BaseComponent } from '../base';
import { WarningsService, OptionsService } from '../../services/index';
var Warnings = /** @class */ (function (_super) {
    __extends(Warnings, _super);
    function Warnings(specMgr, optionsMgr) {
        var _this = _super.call(this, specMgr) || this;
        _this.warnings = [];
        _this.shown = false;
        _this.suppressWarnings = optionsMgr.options.suppressWarnings;
        return _this;
    }
    Warnings.prototype.init = function () {
        var _this = this;
        this.shown = !this.suppressWarnings && !!this.warnings.length;
        WarningsService.warnings.subscribe(function (warns) {
            _this.warnings = warns;
            _this.shown = !_this.suppressWarnings && !!warns.length;
        });
    };
    Warnings.prototype.close = function () {
        this.shown = false;
    };
    Warnings.prototype.ngOnInit = function () {
        this.preinit();
    };
    Warnings.decorators = [
        { type: Component, args: [{
                    selector: 'warnings',
                    styles: [':host{width:60%;display:block}.message{padding:5px 40px;background-color:#fcf8e3;color:#8a6d3b}.message:before{content:"Warning: ";font-weight:700}.warnings-close{font-size:150%;color:#000;opacity:.4;float:right;margin:5px 20px 0 0;font-weight:700;cursor:pointer}.warnings-close:hover{opacity:.8}p{display:inline}'],
                    template: '<div *ngIf="shown"><a class="warnings-close" (click)="close()">×</a><div class="message" *ngFor="let message of warnings">{{message}}</div></div>'
                },] },
    ];
    /** @nocollapse */
    Warnings.ctorParameters = function () { return [
        { type: SpecManager, },
        { type: OptionsService, },
    ]; };
    return Warnings;
}(BaseComponent));
export { Warnings };
//# sourceMappingURL=warnings.js.map