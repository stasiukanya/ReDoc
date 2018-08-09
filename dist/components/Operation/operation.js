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
import { Input, HostBinding, Component, ChangeDetectionStrategy } from '@angular/core';
import JsonPointer from '../../utils/JsonPointer';
import { BaseComponent, SpecManager } from '../base';
import { SchemaHelper } from '../../services/schema-helper.service';
import { OptionsService, MenuService } from '../../services/';
var Operation = /** @class */ (function (_super) {
    __extends(Operation, _super);
    function Operation(specMgr, optionsService, menu) {
        var _this = _super.call(this, specMgr) || this;
        _this.optionsService = optionsService;
        _this.menu = menu;
        _this.pathInMiddlePanel = optionsService.options.pathInMiddlePanel;
        return _this;
    }
    Operation.prototype.init = function () {
        this.operationId = this.componentSchema.operationId;
        this.operation = {
            deprecated: this.componentSchema.deprecated,
            verb: JsonPointer.baseName(this.pointer),
            path: JsonPointer.baseName(this.pointer, 2),
            info: {
                description: this.componentSchema.description,
                tags: this.filterMainTags(this.componentSchema.tags)
            },
            bodyParam: this.findBodyParam(),
            summary: SchemaHelper.operationSummary(this.componentSchema),
            anchor: this.buildAnchor(),
            externalDocs: this.componentSchema.externalDocs
        };
    };
    Operation.prototype.buildAnchor = function () {
        return this.menu.hashFor(this.pointer, { type: 'operation', operationId: this.operationId, pointer: this.pointer }, this.parentTagId);
    };
    Operation.prototype.filterMainTags = function (tags) {
        var tagsMap = this.specMgr.getTagsMap();
        if (!tags)
            return [];
        return tags.filter(function (tag) { return tagsMap[tag] && tagsMap[tag]['x-traitTag']; });
    };
    Operation.prototype.findBodyParam = function () {
        var params = this.specMgr.getOperationParams(this.pointer);
        var bodyParam = params.find(function (param) { return param.in === 'body'; });
        return bodyParam;
    };
    Operation.prototype.ngOnInit = function () {
        this.preinit();
    };
    Operation.decorators = [
        { type: Component, args: [{
                    selector: 'operation',
                    template: '<div class="operation" *ngIf="operation"><div class="operation-content"><h2 class="operation-header sharable-header" [class.deprecated]="operation.deprecated"><a class="share-link" href="#{{operation.anchor}}"></a>{{operation.summary}}</h2><endpoint-link *ngIf="pathInMiddlePanel" [verb]="operation.verb" [path]="operation.path"></endpoint-link><div class="operation-tags" *ngIf="operation.info.tags.length"><a *ngFor="let tag of operation.info.tags" attr.href="#tag/{{tag}}">{{tag}}</a></div><p *ngIf="operation.info.description" class="operation-description" [innerHtml]="operation.info.description | marked"></p><redoc-externalDocs [docs]="operation.externalDocs"></redoc-externalDocs><params-list pointer="{{pointer}}/parameters"></params-list><responses-list pointer="{{pointer}}/responses"></responses-list></div><div class="operation-samples"><endpoint-link *ngIf="!pathInMiddlePanel" [verb]="operation.verb" [path]="operation.path"></endpoint-link><div><request-samples [pointer]="pointer" [schemaPointer]="operation.bodyParam?._pointer"></request-samples></div><div><br><responses-samples pointer="{{pointer}}/responses"></responses-samples></div></div></div>',
                    styles: [':host{padding-bottom:100px;display:block;border-bottom:1px solid rgba(127,127,127,.25);margin-top:1em;transform:translateZ(0);z-index:2}.operation-header{margin-bottom:calc(1em - 6px)}.operation-header.deprecated:after{content:\'Deprecated\';display:inline-block;padding:0 5px;margin:0;background-color:#f1c400;color:#fff;font-weight:700;font-size:13px;vertical-align:text-top}.operation-tags{margin-top:20px}.operation-tags>a{font-size:16px;color:#999;display:inline-block;padding:0 .5em;text-decoration:none}.operation-tags>a:before{content:\'#\';margin-right:-.4em}.operation-tags>a:first-of-type{padding:0}.operation-content,.operation-samples{display:block;box-sizing:border-box;float:left}.operation-content{width:60%;padding:40px}.operation-samples{color:#fafbfc;width:40%;padding:40px;background:#263238}.operation-samples pre{color:#fafbfc}.operation-samples header,.operation-samples>h5{color:#9fb4be;text-transform:uppercase}.operation-samples>h5{margin-bottom:8px}.operation-samples schema-sample{display:block}.operation:after{content:"";display:table;clear:both}.operation-description{padding:6px 0 10px;margin:0}[select-on-click]{cursor:pointer}@media (max-width:1100px){.operations:before{display:none}.operation-content,.operation-samples{width:100%}.operation-samples{margin-top:2em}:host{padding-bottom:0}}.operation-content /deep/ endpoint-link{margin-bottom:16px}.operation-content /deep/ endpoint-link .operation-endpoint[class]{padding:5px 30px 5px 5px;border:0;border-bottom:1px solid #ccc;border-radius:0;background-color:transparent}.operation-content /deep/ endpoint-link .operation-api-url-path{color:#263238}.operation-content /deep/ endpoint-link .expand-icon{top:8px;background-color:#ccc}.operation-content /deep/ endpoint-link .servers-overlay{border:1px solid #ccc;border-top:0}'],
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    Operation.ctorParameters = function () { return [
        { type: SpecManager, },
        { type: OptionsService, },
        { type: MenuService, },
    ]; };
    Operation.propDecorators = {
        'pointer': [{ type: Input },],
        'parentTagId': [{ type: Input },],
        'operationId': [{ type: HostBinding, args: ['attr.operation-id',] },],
    };
    return Operation;
}(BaseComponent));
export { Operation };
//# sourceMappingURL=operation.js.map