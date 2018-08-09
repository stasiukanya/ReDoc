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
import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseSearchableComponent, SpecManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { statusCodeType } from '../../utils/helpers';
import { OptionsService, AppStateService } from '../../services/index';
import { SchemaHelper } from '../../services/schema-helper.service';
function isNumeric(n) {
    return (!isNaN(parseFloat(n)) && isFinite(n));
}
var ResponsesList = /** @class */ (function (_super) {
    __extends(ResponsesList, _super);
    function ResponsesList(specMgr, optionsMgr, app, cdr) {
        var _this = _super.call(this, specMgr, app) || this;
        _this.cdr = cdr;
        _this.options = optionsMgr.options;
        return _this;
    }
    ResponsesList.prototype.init = function () {
        var _this = this;
        this.responses = [];
        var responses = this.componentSchema;
        if (!responses)
            return;
        var hasSuccessResponses = false;
        var respCodes = Object.keys(responses).filter(function (respCode) {
            if ((parseInt(respCode) >= 100) && (parseInt(respCode) <= 399)) {
                hasSuccessResponses = true;
            }
            // only response-codes and "default"
            return (isNumeric(respCode) || (respCode === 'default'));
        });
        responses = respCodes.map(function (respCode) {
            var resp = responses[respCode];
            resp.pointer = JsonPointer.join(_this.pointer, respCode);
            if (resp.$ref) {
                var ref = resp.$ref;
                resp = Object.assign({}, _this.specMgr.byPointer(resp.$ref));
                resp.pointer = ref;
            }
            resp.empty = !resp.schema;
            resp.code = respCode;
            resp.type = statusCodeType(resp.code, hasSuccessResponses);
            resp.expanded = false;
            if (_this.options.expandResponses) {
                if (_this.options.expandResponses === 'all' || _this.options.expandResponses.has(respCode.toString())) {
                    resp.expanded = true;
                }
            }
            if (resp.headers && !(resp.headers instanceof Array)) {
                resp.headers = Object.keys(resp.headers).map(function (k) {
                    var respInfo = resp.headers[k];
                    respInfo.name = k;
                    return SchemaHelper.preprocess(respInfo, _this.pointer, _this.pointer);
                });
                resp.empty = false;
            }
            resp.extendable = resp.headers || resp.length;
            return resp;
        });
        this.responses = responses;
    };
    ResponsesList.prototype.trackByCode = function (_, el) {
        return el.code;
    };
    ResponsesList.prototype.ensureSearchIsShown = function (ptr) {
        if (ptr.startsWith(this.pointer)) {
            var code = JsonPointer.relative(this.pointer, ptr)[0];
            if (code && this.componentSchema[code]) {
                this.componentSchema[code].expanded = true;
                this.cdr.markForCheck();
                this.cdr.detectChanges();
            }
        }
    };
    ResponsesList.prototype.ngOnInit = function () {
        this.preinit();
    };
    ResponsesList.decorators = [
        { type: Component, args: [{
                    selector: 'responses-list',
                    template: '<h2 class="responses-list-header" *ngIf="responses.length">Responses</h2><zippy *ngFor="let response of responses;trackBy:trackByCode" [title]="response.code + \' \' + response.description | marked" [type]="response.type" [(open)]="response.expanded" [empty]="response.empty" (openChange)="lazySchema.load()"><div *ngIf="response.headers" class="response-headers"><header>Headers</header><div class="header" *ngFor="let header of response.headers"><div class="header-name">{{header.name}}</div><div class="header-type {{header.type}}">{{header._displayType}} {{header._displayFormat}} <span class="header-range" *ngIf="header._range">{{header._range}}</span></div><div *ngIf="header.default" class="header-default">Default: {{header.default}}</div><div *ngIf="header.enum" class="header-enum"><span *ngFor="let enumItem of header.enum" class="enum-value {{enumItem.type}}">{{enumItem.val | json}}</span></div><div class="header-description" [innerHtml]="header.description | marked"></div></div></div><header *ngIf="response.schema">Response Schema</header><json-schema-lazy [auto]="response.expanded" #lazySchema pointer="{{response.schema ? response.pointer + \'/schema\' : null}}"></json-schema-lazy></zippy>',
                    styles: [':host{display:block}.header-name,.header-type{display:inline-block;font-weight:700}.responses-list-header{font-size:18px;padding:.2em 0;margin:3em 0 1.1em;color:#253137;font-weight:400}:host .zippy-title{font-family:Montserrat,sans-serif}.header-type{color:#999}header{font-size:14px;font-weight:700;text-transform:uppercase;margin-bottom:15px}header:not(:first-child){margin-top:15px;margin-bottom:0}.header{margin-bottom:10px}.header-range{position:relative;top:1px;margin-right:6px;margin-left:6px;border-radius:2px;background-color:rgba(0,51,160,.1);padding:0 4px;color:rgba(0,51,160,.7)}.header-type.array::before{content:"Array of ";color:#263238;font-weight:300}'],
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    ResponsesList.ctorParameters = function () { return [
        { type: SpecManager, },
        { type: OptionsService, },
        { type: AppStateService, },
        { type: ChangeDetectorRef, },
    ]; };
    ResponsesList.propDecorators = {
        'pointer': [{ type: Input },],
    };
    return ResponsesList;
}(BaseSearchableComponent));
export { ResponsesList };
//# sourceMappingURL=responses-list.js.map