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
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { statusCodeType, getJsonLikeSample, getXmlLikeSample } from '../../utils/helpers';
function isNumeric(n) {
    return (!isNaN(parseFloat(n)) && isFinite(n));
}
function hasExample(response) {
    return response.schema || getXmlLikeSample(response.examples) || getJsonLikeSample(response.examples);
}
var ResponsesSamples = /** @class */ (function (_super) {
    __extends(ResponsesSamples, _super);
    function ResponsesSamples(specMgr) {
        return _super.call(this, specMgr) || this;
    }
    ResponsesSamples.prototype.init = function () {
        var _this = this;
        this.data = {};
        this.data.responses = [];
        var responses = this.componentSchema;
        if (!responses)
            return;
        var hasSuccessResponses = false;
        responses = Object.keys(responses).filter(function (respCode) {
            if ((parseInt(respCode) >= 100) && (parseInt(respCode) <= 399)) {
                hasSuccessResponses = true;
            }
            // only response-codes and "default"
            return (isNumeric(respCode) || (respCode === 'default'));
        }).map(function (respCode) {
            var resp = responses[respCode];
            resp.pointer = JsonPointer.join(_this.pointer, respCode);
            if (resp.$ref) {
                var ref = resp.$ref;
                resp = _this.specMgr.byPointer(resp.$ref);
                resp.pointer = ref;
            }
            resp.code = respCode;
            resp.type = statusCodeType(resp.code, hasSuccessResponses);
            return resp;
        })
            .filter(function (response) { return hasExample(response); });
        this.data.responses = responses;
    };
    ResponsesSamples.prototype.ngOnInit = function () {
        this.preinit();
    };
    ResponsesSamples.decorators = [
        { type: Component, args: [{
                    selector: 'responses-samples',
                    template: '<header *ngIf="data.responses.length">Response samples</header><tabs *ngIf="data.responses.length"><tab *ngFor="let response of data.responses" [tabTitle]="response.code + \' \' + response.description | marked" [tabStatus]="response.type"><schema-sample [pointer]="response.pointer"></schema-sample></tab></tabs>',
                    styles: [':host{overflow:hidden;display:block}header{font-family:Montserrat;font-size:.929em;margin:0;color:#9fb4be;text-transform:uppercase;font-weight:400}:host /deep/>tabs>ul li{font-family:Montserrat;font-size:.929em;border-radius:2px;margin:2px 0;padding:2px 8px 3px;color:#9fb4be;line-height:16px}:host /deep/>tabs>ul li:hover{color:#fff;background-color:rgba(255,255,255,.1)}:host /deep/>tabs>ul li.active{background-color:#fff;color:#263238}:host /deep/ tabs ul{padding-top:10px}'],
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    ResponsesSamples.ctorParameters = function () { return [
        { type: SpecManager, },
    ]; };
    ResponsesSamples.propDecorators = {
        'pointer': [{ type: Input },],
    };
    return ResponsesSamples;
}(BaseComponent));
export { ResponsesSamples };
//# sourceMappingURL=responses-samples.js.map