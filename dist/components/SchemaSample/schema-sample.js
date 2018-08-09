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
import { Component, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import * as OpenAPISampler from 'openapi-sampler';
import JsonPointer from '../../utils/JsonPointer';
import { BaseComponent, SpecManager } from '../base';
import { SchemaNormalizer } from '../../services/schema-normalizer.service';
import { getJsonLikeSample, getXmlLikeSample, getTextLikeSample } from '../../utils/helpers';
var SchemaSample = /** @class */ (function (_super) {
    __extends(SchemaSample, _super);
    function SchemaSample(specMgr, elementRef) {
        var _this = _super.call(this, specMgr) || this;
        _this.enableButtons = false;
        _this.element = elementRef.nativeElement;
        _this._normalizer = new SchemaNormalizer(specMgr);
        return _this;
    }
    SchemaSample.prototype.init = function () {
        this.bindEvents();
        var base = this.componentSchema;
        var sample, xmlSample;
        // got pointer not directly to the schema but e.g. to the response obj
        if (this.componentSchema.schema) {
            base = this.componentSchema;
            this.componentSchema = this.componentSchema.schema;
            this.pointer += '/schema';
        }
        // Support x-examples, allowing requests to specify an example.
        var examplePointer = JsonPointer.join(JsonPointer.dirName(this.pointer), 'x-examples');
        var requestExamples = this.specMgr.byPointer(examplePointer);
        if (requestExamples) {
            base.examples = requestExamples;
        }
        this.xmlSample = base.examples && getXmlLikeSample(base.examples);
        this.textSample = base.examples && getTextLikeSample(base.examples);
        var jsonLikeSample = base.examples && getJsonLikeSample(base.examples);
        if (jsonLikeSample) {
            sample = jsonLikeSample;
        }
        else {
            var selectedDescendant = void 0;
            this.componentSchema = this._normalizer.normalize(this.componentSchema, this.pointer);
            var discriminator = this.componentSchema.discriminator || this.componentSchema['x-discriminatorBasePointer'];
            if (discriminator) {
                var descendants = this.specMgr.findDerivedDefinitions(this.componentSchema._pointer || this.pointer, this.componentSchema);
                if (descendants.length) {
                    // TODO: sync up with dropdown
                    selectedDescendant = descendants[0];
                    var descSchema = this.specMgr.getDescendant(selectedDescendant, this.componentSchema);
                    this.componentSchema = this._normalizer.normalize(Object.assign({}, descSchema), selectedDescendant.$ref, { omitParent: false });
                }
            }
            if (this.fromCache()) {
                this.initButtons();
                return;
            }
            try {
                sample = OpenAPISampler.sample(this.componentSchema, {
                    skipReadOnly: this.skipReadOnly
                });
            }
            catch (e) {
                // no sample available
            }
            if (selectedDescendant) {
                sample[discriminator] = selectedDescendant.name;
            }
        }
        this.cache(sample);
        this.sample = sample;
        this.initButtons();
    };
    SchemaSample.prototype.initButtons = function () {
        if (typeof this.sample === 'object') {
            this.enableButtons = true;
        }
    };
    SchemaSample.prototype.cache = function (sample) {
        if (this.skipReadOnly) {
            this.componentSchema['x-redoc-ro-sample'] = sample;
        }
        else {
            this.componentSchema['x-redoc-rw-sample'] = sample;
        }
    };
    SchemaSample.prototype.fromCache = function () {
        if (this.skipReadOnly && this.componentSchema['x-redoc-ro-sample']) {
            this.sample = this.componentSchema['x-redoc-ro-sample'];
            return true;
        }
        else if (!this.skipReadOnly && this.componentSchema['x-redoc-rw-sample']) {
            this.sample = this.componentSchema['x-redoc-rw-sample'];
            return true;
        }
        return false;
    };
    SchemaSample.prototype.bindEvents = function () {
        this.element.addEventListener('click', function (event) {
            var collapsed, target = event.target;
            if (event.target.className === 'collapser') {
                collapsed = target.parentNode.getElementsByClassName('collapsible')[0];
                if (collapsed.parentNode.classList.contains('collapsed')) {
                    collapsed.parentNode.classList.remove('collapsed');
                }
                else {
                    collapsed.parentNode.classList.add('collapsed');
                }
            }
        });
    };
    SchemaSample.prototype.expandAll = function () {
        var elements = this.element.getElementsByClassName('collapsible');
        for (var i = 0; i < elements.length; i++) {
            var collapsed = elements[i];
            collapsed.parentNode.classList.remove('collapsed');
        }
    };
    SchemaSample.prototype.collapseAll = function () {
        var elements = this.element.getElementsByClassName('collapsible');
        for (var i = 0; i < elements.length; i++) {
            var expanded = elements[i];
            if (expanded.parentNode.classList.contains('redoc-json'))
                continue;
            expanded.parentNode.classList.add('collapsed');
        }
    };
    SchemaSample.prototype.ngOnInit = function () {
        this.preinit();
    };
    SchemaSample.decorators = [
        { type: Component, args: [{
                    selector: 'schema-sample',
                    template: '<ng-template #jsonSnippet><div class="snippet"><pre *ngIf="sample == undefined"> Sample unavailable </pre><div class="action-buttons"><span copy-button [copyText]="sample" class="hint--top-left hint--inversed"><a>Copy</a> </span><span><a *ngIf="enableButtons" (click)="expandAll()">Expand all</a> </span><span><a *ngIf="enableButtons" (click)="collapseAll()">Collapse all</a></span></div><pre [innerHtml]="sample | jsonFormatter"></pre></div></ng-template><tabs *ngIf="xmlSample || textSample; else jsonSnippet"><tab tabTitle="JSON" *ngIf="sample"><ng-container *ngTemplateOutlet="jsonSnippet"></ng-container></tab><tab tabTitle="XML" *ngIf="xmlSample"><div class="snippet"><div class="action-buttons"><span copy-button [copyText]="xmlSample" class="hint--top-left hint--inversed"><a>Copy</a></span></div><pre class="response-sample" [innerHtml]="xmlSample | prism:\'xml\'"></pre></div></tab><tab tabTitle="text/plain" *ngIf="textSample"><div class="snippet"><div class="action-buttons"><span copy-button [copyText]="xmlSample" class="hint--top-left hint--inversed"><a>Copy</a></span></div><pre class="response-sample">{{textSample}}</pre></div></tab></tabs>',
                    styles: ['@charset "UTF-8";:host{display:block}:host /deep/ tabs{margin-top:1em}:host /deep/ tabs>ul{margin:0;padding:0}:host /deep/ tabs>ul>li{padding:2px 10px;display:inline-block;background:#131a1d;border-bottom:1px solid trasparent;color:#9fb4be}:host /deep/ tabs>ul>li.active{color:#fff;border-bottom:1px solid #9fb4be}:host /deep/ tabs .action-buttons{margin-top:-2em}pre{background-color:transparent;padding:0;margin:0;clear:both;position:relative}.action-buttons{opacity:0;transition:opacity .3s ease;transform:translateY(100%);z-index:3;position:relative;height:2em;line-height:2em;padding-right:10px;text-align:right;margin-top:-1em}.action-buttons>span>a{padding:2px 10px;color:#fff;cursor:pointer}.action-buttons>span>a:hover{background-color:#455b66}.snippet:hover .action-buttons{opacity:1}:host /deep/ .type-null{color:gray}:host /deep/ .type-boolean{color:#b22222}:host /deep/ .type-number{color:#4A8BB3}:host /deep/ .type-string{color:#66B16E}:host /deep/ .type-string+a{color:#66B16E;text-decoration:underline}:host /deep/ .callback-function{color:gray}:host /deep/ .collapser:after{content:"-";cursor:pointer}:host /deep/ .collapsed>.collapser:after{content:"+";cursor:pointer}:host /deep/ .ellipsis:after{content:" … "}:host /deep/ .collapsible{margin-left:2em}:host /deep/ .hoverable{border-radius:2px;padding:1px 2px}:host /deep/ .hovered{background-color:#ebeef9}:host /deep/ .collapser{padding-right:6px;padding-left:6px}:host /deep/ .redoc-json,:host /deep/ .response-sample{overflow-x:auto;padding:20px;border-radius:4px;background-color:#222d32;margin-bottom:36px}:host /deep/ .redoc-json ul,:host /deep/ ul{list-style-type:none;padding:0;margin:0 0 0 26px}:host /deep/ li{position:relative;display:block}:host /deep/ .hoverable{transition:background-color .2s ease-out 0s;-webkit-transition:background-color .2s ease-out 0s;display:inline-block}:host /deep/ .hovered{transition-delay:.2s;-webkit-transition-delay:.2s}:host /deep/ .selected{outline-width:1px;outline-style:dotted}:host /deep/ .collapsed>.collapsible{display:none}:host /deep/ .ellipsis{display:none}:host /deep/ .collapsed>.ellipsis{display:inherit}:host /deep/ .collapser{position:absolute;top:1px;left:-1.5em;cursor:default;user-select:none;-webkit-user-select:none}:host /deep/ .redoc-json>.collapser{display:none}'],
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    SchemaSample.ctorParameters = function () { return [
        { type: SpecManager, },
        { type: ElementRef, },
    ]; };
    SchemaSample.propDecorators = {
        'pointer': [{ type: Input },],
        'skipReadOnly': [{ type: Input },],
    };
    return SchemaSample;
}(BaseComponent));
export { SchemaSample };
//# sourceMappingURL=schema-sample.js.map