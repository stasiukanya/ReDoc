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
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
var ApiLogo = /** @class */ (function (_super) {
    __extends(ApiLogo, _super);
    function ApiLogo(specMgr) {
        var _this = _super.call(this, specMgr) || this;
        _this.logo = {};
        return _this;
    }
    ApiLogo.prototype.init = function () {
        var info = this.componentSchema.info;
        var logoInfo = info['x-logo'];
        if (!logoInfo)
            return;
        this.logo.imgUrl = logoInfo.url;
        this.logo.bgColor = logoInfo.backgroundColor || 'transparent';
        this.logo.url = info.contact && info.contact.url || null;
    };
    ApiLogo.prototype.ngOnInit = function () {
        this.preinit();
    };
    ApiLogo.decorators = [
        { type: Component, args: [{
                    selector: 'api-logo',
                    styles: [':host{display:block;text-align:center}@media (max-width:1000px){:host{display:none}}img{max-height:150px;width:auto;display:inline-block;max-width:100%;box-sizing:border-box}'],
                    template: '<a *ngIf="logo.url" href="{{logo.url}}"><img *ngIf="logo.imgUrl" [attr.src]="logo.imgUrl" [ngStyle]="{\'background-color\': logo.bgColor}"> </a><img *ngIf="logo.imgUrl && !logo.url" [attr.src]="logo.imgUrl" [ngStyle]="{\'background-color\': logo.bgColor}">',
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    ApiLogo.ctorParameters = function () { return [
        { type: SpecManager, },
    ]; };
    return ApiLogo;
}(BaseComponent));
export { ApiLogo };
//# sourceMappingURL=api-logo.js.map