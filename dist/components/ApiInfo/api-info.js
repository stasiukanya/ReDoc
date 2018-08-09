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
import { Component, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SpecManager, BaseComponent } from '../base';
import { OptionsService, Marker } from '../../services/index';
var ApiInfo = /** @class */ (function (_super) {
    __extends(ApiInfo, _super);
    function ApiInfo(specMgr, optionsService, elRef, marker, sanitizer) {
        var _this = _super.call(this, specMgr) || this;
        _this.optionsService = optionsService;
        _this.sanitizer = sanitizer;
        _this.info = {};
        _this.downloadFilename = '';
        _this.hideDownloadButton = _this.optionsService.options.hideDownloadButton;
        marker.addElement(elRef.nativeElement);
        return _this;
    }
    ApiInfo.prototype.init = function () {
        this.info = this.componentSchema.info;
        this.specUrl = this.specMgr.specUrl;
        if (!this.specUrl && window.Blob && window.URL) {
            var blob = new Blob([JSON.stringify(this.specMgr.rawSpec, null, 2)], { type: 'application/json' });
            this.specUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
            this.downloadFilename = 'swagger.json';
        }
        if (!isNaN(parseInt(this.info.version.toString().substring(0, 1)))) {
            this.info.version = 'v' + this.info.version;
        }
    };
    ApiInfo.prototype.ngOnInit = function () {
        this.preinit();
    };
    ApiInfo.decorators = [
        { type: Component, args: [{
                    selector: 'api-info',
                    styles: [':host>.api-info-wrapper{box-sizing:border-box;padding:40px;width:60%}@media (max-width:1100px){:host>.api-info-wrapper{width:100%}}@media (max-width:1000px){:host>.api-info-wrapper{padding-top:60px}}.openapi-button{border:1px solid #0033a0;color:#0033a0;font-weight:400;margin-left:.5em;padding:3px 8px 4px;display:inline-block}:host /deep/ [section]{padding-top:80px}:host /deep/ h2[section]{padding-top:40px}'],
                    template: '<div class="api-info-wrapper"><h1>{{info.title}} <span class="api-info-version">({{info.version}})</span></h1><p class="download-openapi" *ngIf="specUrl && !hideDownloadButton">Download OpenAPI specification: <a class="openapi-button" [attr.download]="downloadFilename" [attr.href]="specUrl">Download</a></p><p><span *ngIf="info?.contact?.url || info?.contact?.email">Contact: <a *ngIf="info.contact.url" href="{{info.contact.url}}">{{info.contact.name || info.contact.url}}</a> <a *ngIf="info.contact.email" href="mailto:{{info.contact.email}}">{{info.contact.email}}</a> </span><span *ngIf="info.license">License: <a *ngIf="info.license.url" href="{{info.license.url}}">{{info.license.name}} </a><span *ngIf="!info.license.url">{{info.license.name}}</span></span><redoc-externalDocs [docs]="componentSchema.externalDocs"></redoc-externalDocs></p><span class="redoc-markdown-block"><dynamic-ng2-viewer [html]="info[\'x-redoc-html-description\']"></dynamic-ng2-viewer></span></div>',
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    ApiInfo.ctorParameters = function () { return [
        { type: SpecManager, },
        { type: OptionsService, },
        { type: ElementRef, },
        { type: Marker, },
        { type: DomSanitizer, },
    ]; };
    return ApiInfo;
}(BaseComponent));
export { ApiInfo };
//# sourceMappingURL=api-info.js.map