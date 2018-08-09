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
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OptionsService } from '../../services/options.service';
import { SchemaHelper } from '../../services/schema-helper.service';
import { BaseComponent, SpecManager } from '../base';
function safePush(obj, prop, item) {
    if (!obj[prop])
        obj[prop] = [];
    obj[prop].push(item);
}
var ParamsList = /** @class */ (function (_super) {
    __extends(ParamsList, _super);
    function ParamsList(specMgr, options) {
        var _this = _super.call(this, specMgr) || this;
        _this.options = options;
        return _this;
    }
    ParamsList.prototype.init = function () {
        var _this = this;
        this.params = [];
        var paramsList = this.specMgr.getOperationParams(this.pointer);
        var igrnoredHeaders = this.specMgr.schema['x-ignoredHeaderParameters'] ||
            this.options.options.ignoredHeaderParameters ||
            [];
        paramsList = paramsList
            .map(function (paramSchema) {
            var propPointer = paramSchema._pointer;
            if (paramSchema.in === 'body')
                return paramSchema;
            return SchemaHelper.preprocess(paramSchema, propPointer, _this.pointer);
        })
            .filter(function (param) {
            return param.in !== 'header' || igrnoredHeaders.indexOf(param.name) < 0;
        });
        var paramsMap = this.orderParams(paramsList);
        if (paramsMap.body && paramsMap.body.length) {
            var bodyParam = paramsMap.body[0];
            this.bodyParam = bodyParam;
            paramsMap.body = undefined;
        }
        this.empty = !(Object.keys(paramsMap).length || this.bodyParam);
        var paramsPlaces = ['path', 'query', 'formData', 'header', 'body'];
        var placeHint = {
            path: "Used together with Path Templating, where the parameter value is actually part\n        of the operation's URL. This does not include the host or base path of the API.\n        For example, in /items/{itemId}, the path parameter is itemId",
            query: "Parameters that are appended to the URL.\n        For example, in /items?id=###, the query parameter is id",
            formData: "Parameters that are submitted through a form.\n        application/x-www-form-urlencoded, multipart/form-data or both are usually\n        used as the content type of the request",
            header: 'Custom headers that are expected as part of the request'
        };
        var params = [];
        paramsPlaces.forEach(function (place) {
            if (paramsMap[place] && paramsMap[place].length) {
                params.push({ place: place, placeHint: placeHint[place], params: paramsMap[place] });
            }
        });
        this.params = params;
    };
    ParamsList.prototype.orderParams = function (params) {
        var res = {};
        params.forEach(function (param) { return safePush(res, param.in, param); });
        return res;
    };
    ParamsList.prototype.ngOnInit = function () {
        this.preinit();
    };
    ParamsList.decorators = [
        { type: Component, args: [{
                    selector: 'params-list',
                    template: '<h5 class="param-list-header" *ngIf="params.length">Parameters</h5><ng-template ngFor [ngForOf]="params" let-paramType="$implicit"><header class="paramType">{{paramType.place}} Parameters <span class="hint--top-right hint--large" [attr.data-hint]="paramType.placeHint">?</span></header><div class="params-wrap"><div *ngFor="let param of paramType.params" class="param"><div class="param-name"><span class="param-name-wrap">{{param.name}}</span></div><div class="param-info"><div><span *ngIf=\'param.type === "array"\' class="param-array-format param-collection-format-{{param.collectionFormat}}">{{param | collectionFormat}} </span><span class="param-type {{param.type}}" [ngClass]="{\'with-hint\': param._displayTypeHint}" title="{{param._displayTypeHint}}">{{param._displayType}} {{param._displayFormat}}</span> <span class="param-range" *ngIf="param._range">{{param._range}} </span><span *ngIf="param.required" class="param-required">Required</span><div class="param-default" *ngIf="param.default != null"><span class="param-default-value">{{param.default | json}}</span></div><div class="param-example" *ngIf="param.example != null"><span class="param-example-value">{{param.example | json}}</span></div><div *ngIf="param.enum || param._enumItem" class="param-enum"><span *ngFor="let enumItem of param.enum" class="param-enum-value {{enumItem.type}}">{{enumItem.val | json}} </span><span *ngIf="param._enumItem" class="param-enum-value {{param._enumItem.type}}">{{param._enumItem.val | json}}</span></div><span *ngIf="param.pattern" class="param-pattern">{{param.pattern}}</span></div><div class="param-description" [innerHtml]="param.description | marked"></div></div></div></div></ng-template><div *ngIf="bodyParam"><h5 class="param-list-header" *ngIf="bodyParam">Request Body</h5><div class="body-param-description" [innerHtml]="bodyParam.description | marked"></div><div><br><json-schema-lazy [isRequestSchema]="true" [auto]="true" pointer="{{bodyParam._pointer}}/schema"></json-schema-lazy></div></div>',
                    styles: [':host{display:block}.param-name-wrap,.param-type-trivial,.param-type.with-hint{display:inline-block}.param-list-header{border-bottom:1px solid rgba(38,50,56,.3);margin:3em 0 1em;color:rgba(38,50,56,.5);font-weight:400;text-transform:uppercase}.param-nullable,.param-required{font-size:12px;font-weight:700;vertical-align:middle}.param-name-wrap{padding-right:25px;font-family:Montserrat,sans-serif}.param-info{border-bottom:1px solid #9fb4be;padding:10px 0;box-sizing:border-box}.param-info>div{line-height:1}.param-range{position:relative;top:1px;margin-right:6px;margin-left:6px;border-radius:2px;background-color:rgba(0,51,160,.1);padding:0 4px;color:rgba(0,51,160,.7)}.param-required{line-height:20px;color:#e53935}.param-nullable{line-height:20px;color:#3195a6}.param-array-format,.param-type{vertical-align:middle;line-height:20px;color:rgba(38,50,56,.4);font-size:.929em}.param-type{font-weight:400;word-break:break-all}.param-type.array::before,.param-type.tuple::before{color:#263238;font-weight:300}.param-collection-format-multi+.param-type.array::before,.param-collection-format-multi+.param-type.tuple::before{content:none}.param-type.array::before{content:"Array of "}.param-type.tuple::before{content:"Tuple "}.param-type.with-hint{margin-bottom:.4em;border-bottom:1px dotted rgba(38,50,56,.4);padding:0;cursor:help}.param-type-file{font-weight:700;text-transform:capitalize}.param-name{border-left:1px solid rgba(0,51,160,.5);box-sizing:border-box;position:relative;padding:10px 0;line-height:20px;white-space:nowrap;font-size:.929em;font-weight:400}.param-name>span::before{content:\'\';display:inline-block;width:1px;height:7px;background-color:#0033a0;margin:0 10px;vertical-align:middle}.param-name>span::after{content:\'\';position:absolute;border-top:1px solid rgba(0,51,160,.5);width:10px;left:0;top:21px}.param:first-of-type>.param-name::before{content:\'\';display:block;position:absolute;left:-1px;top:0;border-left:2px solid #fff;height:21px}.param.last>.param-name,.param:last-of-type>.param-name{position:relative}.param.last>.param-name::after,.param:last-of-type>.param-name::after{content:\'\';display:block;position:absolute;left:-2px;border-left:2px solid #fff;top:22px;background-color:#fff;bottom:0}.param-wrap:last-of-type>.param-schema{border-left-color:transparent}.param-schema .param-wrap:first-of-type .param-name::before{display:none}.param-schema.last>td{border-left:0}.param-enum{color:#263238;font-size:.95em}.param-enum::before{content:\'Valid values: \'}.param-type.array~.param-enum::before{content:\'Valid items values: \'}.param-pattern{color:#3195a6;white-space:nowrap}.param-pattern::after,.param-pattern::before{content:\'/\';margin:0 3px;font-size:1.2em;font-weight:700}.param-default,.param-example{font-size:.95em}.param-default::before{content:\'Default: \'}.param-example::before{content:\'Example: \'}.param-default-value,.param-enum-value,.param-example-value{font-family:Courier,monospace;background-color:rgba(38,50,56,.02);border:1px solid rgba(38,50,56,.1);margin:2px 3px;padding:.1em .2em .2em;border-radius:2px;color:#263238;display:inline-block;min-width:20px;text-align:center}header.paramType{margin:25px 0 5px;text-transform:capitalize}.param-array-format{color:#000;font-weight:300}.params-wrap{display:table;width:100%}.param-name{display:table-cell;vertical-align:top}.param-info{display:table-cell;width:75%}.param{display:table-row}.param:first-of-type .param-name:after,.param:last-of-type>.param-name:after{content:"";display:block;position:absolute;background-color:#fff;top:0}.param:last-of-type>.param-name{border-left:0}.param:last-of-type>.param-name:after{left:0;border-left:1px solid rgba(0,51,160,.5);height:21px}.param:first-of-type .param-name:after{left:-1px;border-left:2px solid #fff;height:20px}[data-hint]{width:1.2em;text-align:center;border-radius:50%;vertical-align:middle;color:#999;line-height:1.2;text-transform:none;cursor:help;border:1px solid #999;margin-left:.5em}@media (max-width:520px){[data-hint]{float:right}[data-hint]:after{margin-left:12px;transform:translateX(-100%) translateY(-8px);-moz-transform:translateX(-100%) translateY(-8px);-webkit-transform:translateX(-100%) translateY(-8px)}}'],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /** @nocollapse */
    ParamsList.ctorParameters = function () { return [
        { type: SpecManager, },
        { type: OptionsService, },
    ]; };
    ParamsList.propDecorators = {
        'pointer': [{ type: Input },],
    };
    return ParamsList;
}(BaseComponent));
export { ParamsList };
//# sourceMappingURL=params-list.js.map