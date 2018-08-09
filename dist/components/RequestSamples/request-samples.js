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
import { Component, ViewChildren, Input, ChangeDetectionStrategy, HostBinding, ElementRef, NgZone } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { Tabs } from '../../shared/components/index';
import { AppStateService, ScrollService } from '../../services/index';
var RequestSamples = /** @class */ (function (_super) {
    __extends(RequestSamples, _super);
    function RequestSamples(specMgr, appState, scrollService, el, zone) {
        var _this = _super.call(this, specMgr) || this;
        _this.appState = appState;
        _this.scrollService = scrollService;
        _this.el = el;
        _this.zone = zone;
        _this.selectedLang = _this.appState.samplesLanguage;
        return _this;
    }
    RequestSamples.prototype.changeLangNotify = function (lang) {
        var _this = this;
        var relativeScrollPos = this.scrollService.relativeScrollPos(this.el.nativeElement);
        this.selectedLang.next(lang);
        // do scroll in the end of VM turn to have it seamless
        var subscription = this.zone.onMicrotaskEmpty.subscribe(function () {
            _this.scrollService.scrollTo(_this.el.nativeElement, relativeScrollPos);
            subscription.unsubscribe();
        });
    };
    RequestSamples.prototype.init = function () {
        this.schemaPointer = this.schemaPointer ? JsonPointer.join(this.schemaPointer, 'schema') : null;
        this.samples = this.componentSchema['x-code-samples'] || [];
        if (!this.schemaPointer && !this.samples.length)
            this.hidden = true;
    };
    RequestSamples.prototype.ngOnInit = function () {
        this.preinit();
    };
    RequestSamples.decorators = [
        { type: Component, args: [{
                    selector: 'request-samples',
                    template: '<header *ngIf="schemaPointer || samples.length">Request samples</header><schema-sample *ngIf="schemaPointer && !samples.length" [skipReadOnly]="true" [pointer]="schemaPointer"></schema-sample><tabs *ngIf="samples.length" [selected]="selectedLang" (change)="changeLangNotify($event)"><tab *ngIf="schemaPointer" tabTitle="JSON"><schema-sample [pointer]="schemaPointer" [skipReadOnly]="true"></schema-sample></tab><tab *ngFor="let sample of samples" [tabTitle]="sample.lang"><div class="code-sample"><div class="action-buttons"><span copy-button [copyText]="sample.source" class="hint--top-left hint--inversed"><a>Copy</a></span></div><pre [innerHtml]="sample.source | prism:sample.lang"></pre></div></tab></tabs>',
                    styles: [':host{overflow:hidden;display:block}.action-buttons{opacity:0;transition:opacity .3s ease;transform:translateY(100%);z-index:3;position:relative;height:2em;line-height:2em;padding-right:10px;text-align:right;margin-top:-1em}.action-buttons>span>a{padding:2px 10px;color:#fff;cursor:pointer}.action-buttons>span>a:hover{background-color:#455b66}.code-sample:hover>.action-buttons{opacity:1}header{font-family:Montserrat;font-size:.929em;margin:20px 0 0;color:#9fb4be;text-transform:uppercase;font-weight:400}:host /deep/>tabs>ul li{font-family:Montserrat;font-size:.9em;border-radius:2px;margin:2px 0;padding:3px 10px 2px;line-height:16px;color:#9fb4be}:host /deep/>tabs>ul li:hover{background-color:rgba(255,255,255,.1);color:#fff}:host /deep/>tabs>ul li.active{background-color:#fff;color:#263238}:host /deep/ tabs ul{padding-top:10px}.code-sample pre{word-break:break-all;word-wrap:break-word;white-space:pre-wrap;margin-top:0;overflow-x:auto;padding:20px;border-radius:4px;background-color:#222d32;margin-bottom:36px}'],
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    RequestSamples.ctorParameters = function () { return [
        { type: SpecManager, },
        { type: AppStateService, },
        { type: ScrollService, },
        { type: ElementRef, },
        { type: NgZone, },
    ]; };
    RequestSamples.propDecorators = {
        'pointer': [{ type: Input },],
        'schemaPointer': [{ type: Input },],
        'childQuery': [{ type: ViewChildren, args: [Tabs,] },],
        'hidden': [{ type: HostBinding, args: ['attr.hidden',] },],
    };
    return RequestSamples;
}(BaseComponent));
export { RequestSamples };
//# sourceMappingURL=request-samples.js.map