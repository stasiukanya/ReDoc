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
import { Component, Input, Renderer, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseSearchableComponent, SpecManager } from '../base';
import { SchemaNormalizer, SchemaHelper, AppStateService, OptionsService } from '../../services/';
import { JsonPointer } from '../../utils/';
var JsonSchema = /** @class */ (function (_super) {
    __extends(JsonSchema, _super);
    function JsonSchema(specMgr, app, _renderer, cdr, _elementRef, optionsService) {
        var _this = _super.call(this, specMgr, app) || this;
        _this._renderer = _renderer;
        _this.cdr = cdr;
        _this._elementRef = _elementRef;
        _this.optionsService = optionsService;
        _this.final = false;
        _this.schema = {};
        _this.activeDescendant = {};
        _this.discriminator = null;
        _this._hasSubSchemas = false;
        _this.normalizer = new SchemaNormalizer(specMgr);
        return _this;
    }
    Object.defineProperty(JsonSchema.prototype, "normPointer", {
        get: function () {
            return this.schema._pointer || this.pointer;
        },
        enumerable: true,
        configurable: true
    });
    JsonSchema.prototype.selectDescendantByIdx = function (idx) {
        this.selectDescendant(this.descendants[idx]);
    };
    JsonSchema.prototype.selectDescendant = function (activeDescendant) {
        if (!activeDescendant || activeDescendant.active)
            return;
        this.descendants.forEach(function (d) {
            d.active = false;
        });
        activeDescendant.active = true;
        this.schema = this.specMgr.getDescendant(activeDescendant, this.componentSchema);
        this.pointer = this.schema._pointer || activeDescendant.$ref;
        this.normalizer.reset();
        this.schema = this.normalizer.normalize(this.schema, this.normPointer, { resolved: true });
        this.preprocessSchema();
        this.activeDescendant = activeDescendant;
    };
    JsonSchema.prototype.initDescendants = function () {
        this.descendants = this.specMgr.findDerivedDefinitions(this.normPointer, this.schema);
        if (!this.descendants.length)
            return;
        var discriminator = this.discriminator = this.schema.discriminator || this.schema['x-extendedDiscriminator'];
        var discrProperty = this.schema.properties &&
            this.schema.properties[discriminator];
        if (discrProperty && discrProperty.enum) {
            var enumOrder_1 = {};
            discrProperty.enum.forEach(function (enumItem, idx) {
                enumOrder_1[enumItem] = idx;
            });
            this.descendants = this.descendants
                .filter(function (a) {
                return enumOrder_1[a.name] != undefined;
            }).sort(function (a, b) {
                return enumOrder_1[a.name] > enumOrder_1[b.name] ? 1 : -1;
            });
        }
        this.descendants.forEach(function (d, idx) { return d.idx = idx; });
        this.selectDescendantByIdx(0);
    };
    JsonSchema.prototype.init = function () {
        if (!this.pointer)
            return;
        if (!this.absolutePointer)
            this.absolutePointer = this.pointer;
        this.schema = this.componentSchema;
        if (!this.schema) {
            throw new Error("Can't load component schema at " + this.pointer);
        }
        this.applyStyling();
        this.schema = this.normalizer.normalize(this.schema, this.normPointer, { resolved: true });
        this.schema = SchemaHelper.unwrapArray(this.schema, this.normPointer);
        this._isArray = this.schema._isArray;
        this.absolutePointer += (this._isArray ? '/items' : '');
        this.initDescendants();
        this.preprocessSchema();
    };
    JsonSchema.prototype.preprocessSchema = function () {
        SchemaHelper.preprocess(this.schema, this.normPointer, this.pointer);
        if (!this.schema.isTrivial) {
            SchemaHelper.preprocessProperties(this.schema, this.normPointer, {
                childFor: this.childFor,
                discriminator: this.discriminator
            });
        }
        this.properties = this.schema._properties || [];
        if (this.isRequestSchema) {
            this.properties = this.properties.filter(function (prop) { return !prop.readOnly; });
        }
        if (this.optionsService.options.requiredPropsFirst) {
            SchemaHelper.moveRequiredPropsFirst(this.properties, this.schema.required);
        }
        this._hasSubSchemas = this.properties && this.properties.some(function (propSchema) {
            if (propSchema.type === 'array') {
                propSchema = propSchema.items;
            }
            return (propSchema && propSchema.type === 'object' && propSchema._pointer);
        });
        if (this.properties.length === 1) {
            this.properties[0].expanded = true;
        }
    };
    JsonSchema.prototype.applyStyling = function () {
        if (this.nestOdd) {
            this._renderer.setElementAttribute(this._elementRef.nativeElement, 'nestodd', 'true');
        }
    };
    JsonSchema.prototype.trackByName = function (_, item) {
        return item.name + (item._pointer || '');
    };
    JsonSchema.prototype.trackByIdx = function (idx, _) {
        return idx;
    };
    JsonSchema.prototype.findDescendantWithField = function (fieldName) {
        var res;
        for (var _i = 0, _a = this.descendants; _i < _a.length; _i++) {
            var descendantInfo = _a[_i];
            var schema = this.specMgr.getDescendant(descendantInfo, this.schema);
            this.normalizer.reset();
            schema = this.normalizer.normalize(schema, this.normPointer, { resolved: true });
            if (schema.properties && schema.properties[fieldName]) {
                res = descendantInfo;
                break;
            }
            ;
        }
        ;
        return res;
    };
    JsonSchema.prototype.ensureSearchIsShown = function (ptr) {
        if (ptr.startsWith(this.absolutePointer)) {
            var props = this.properties;
            if (!props)
                return;
            var relative = JsonPointer.relative(this.absolutePointer, ptr);
            var propName_1;
            if (relative.length > 1 && relative[0] === 'properties') {
                propName_1 = relative[1];
            }
            var prop = props.find(function (p) { return p.name === propName_1; });
            if (!prop) {
                var d = this.findDescendantWithField(propName_1);
                this.selectDescendant(d);
                prop = this.properties.find(function (p) { return p.name === propName_1; });
            }
            if (prop && !prop.isTrivial)
                prop.expanded = true;
            this.cdr.markForCheck();
            this.cdr.detectChanges();
        }
    };
    JsonSchema.prototype.ngOnInit = function () {
        this.preinit();
    };
    JsonSchema.decorators = [
        { type: Component, args: [{
                    selector: 'json-schema',
                    template: '<ng-container [ngSwitch]="schema._widgetType"><ng-template ngSwitchCase="file"><span class="param-wrap"><span class="param-type-file">file</span><div *ngIf="schema._produces && !isRequestSchema" class="file produces"><ul><li *ngFor="let type of schema._produces">{{type}}</li></ul></div><div *ngIf="schema._consumes && isRequestSchema" class="file consume"><ul><li *ngFor="let type of schema._consumes">{{type}}</li></ul></div></span></ng-template><ng-template ngSwitchCase="trivial"><span class="param-wrap"><span class="param-type param-type-trivial {{schema.type}}" [ngClass]="{\'with-hint\': schema._displayTypeHint, \'array\': _isArray}" title="{{schema._displayTypeHint}}">{{schema._displayType}} {{schema._displayFormat}} <span class="param-range" *ngIf="schema._range">{{schema._range}} </span></span><span *ngIf="schema[\'x-nullable\']" class="param-nullable">Nullable</span><div *ngIf="schema.enum" class="param-enum"><span *ngFor="let enumItem of schema.enum" class="param-enum-value {{enumItem.type}}">{{enumItem.val | json}}</span></div><span *ngIf="schema.pattern" class="param-pattern">{{schema.pattern}}</span></span></ng-template><ng-template ngSwitchCase="tuple"><div class="params-wrap params-array array-tuple"><ng-template ngFor [ngForOf]="schema.items" let-item="$implicit" let-idx="index" [ngForTrackBy]="trackByIdx"><div class="tuple-item"><span class="tuple-item-index">[{{idx}}]:</span><json-schema class="nested-schema" [pointer]="item._pointer" [absolutePointer]="item._pointer" [nestOdd]="!nestOdd" [isRequestSchema]="isRequestSchema"></json-schema></div></ng-template></div></ng-template><ng-template ngSwitchCase="array"><json-schema class="nested-schema" [pointer]="schema._pointer" [nestOdd]="!nestOdd" [isRequestSchema]="isRequestSchema"></json-schema></ng-template><ng-template ngSwitchCase="object"><table class="params-wrap" [ngClass]="{\'params-array\': _isArray}"><ng-template ngFor [ngForOf]="properties" let-prop="$implicit" let-last="last" [ngForTrackBy]="trackByName"><tr class="param" [class.last]="last" [class.discriminator]="prop.isDiscriminator" [class.complex]="prop._pointer" [class.additional]="prop._additional" [class.expanded]="subSchema.open"><td class="param-name"><span class="param-name-wrap" (click)="subSchema.toggle()"><span class="param-name-content">{{prop.name}} <span class="param-name-enumvalue" [hidden]="!prop._enumItem">{{prop._enumItem?.val | json}} </span></span><svg *ngIf="prop._pointer" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 24 24" xml:space="preserve"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "/></svg></span></td><td class="param-info"><div><span class="param-type {{prop.type}}" [ngClass]="{\'with-hint\': prop._displayTypeHint, \'tuple\': prop._isTuple, \'array\': (prop._isArray || prop.type == \'array\')}" title="{{prop._displayTypeHint}}">{{prop._displayType}} {{prop._displayFormat}} <span class="param-range" *ngIf="prop._range">{{prop._range}} </span></span><span *ngIf="prop._required" class="param-required">Required</span> <span *ngIf="prop[\'x-nullable\']" class="param-nullable">Nullable</span><div class="param-default" *ngIf="prop.default != null"><span class="param-default-value">{{prop.default | json}}</span></div><div *ngIf="prop.enum && !prop.isDiscriminator" class="param-enum"><span *ngFor="let enumItem of prop.enum" class="param-enum-value {{enumItem.type}}">{{enumItem.val | json}}</span></div><span *ngIf="prop.pattern" class="param-pattern">{{prop.pattern}}</span></div><div class="param-description" [innerHtml]="prop.description | marked"></div><div class="discriminator-info" *ngIf="prop.isDiscriminator && descendants.length"><drop-down (change)="selectDescendantByIdx($event)" [active]="activeDescendant.idx"><option *ngFor="let descendant of descendants; let i=index" [value]="i" [attr.selected]="descendant.active ? \'\' : null" >{{descendant.name}}</option></drop-down></div></td></tr><tr class="param-schema" [ngClass]="{\'last\': last}" [hidden]="!prop._pointer"><td colspan="2"><zippy [attr.disabled]="prop.name" #subSchema title="Expand" [headless]="true" (openChange)="lazySchema.load()" [(open)]="prop.expanded"><json-schema-lazy #lazySchema [auto]="prop.expanded" class="nested-schema" [pointer]="prop._pointer" [nestOdd]="!nestOdd" [isRequestSchema]="isRequestSchema" absolutePointer="{{absolutePointer}}/properties/{{prop.name}}"></json-schema-lazy></zippy></td></tr></ng-template></table></ng-template></ng-container>',
                    styles: ['.param-array-format,.param-nullable,.param-required,.param-type{vertical-align:middle;line-height:20px}.param-name-wrap,.param-type-trivial,.param-type.with-hint{display:inline-block}.param-name-wrap{padding-right:25px;font-family:Montserrat,sans-serif}.param-info{border-bottom:1px solid #9fb4be;padding:10px 0;width:75%;box-sizing:border-box}.param-info>div{line-height:1}.param-range{position:relative;top:1px;margin-right:6px;margin-left:6px;border-radius:2px;background-color:rgba(0,51,160,.1);padding:0 4px;color:rgba(0,51,160,.7)}.param-required{color:#e53935;font-size:12px;font-weight:700}.param-nullable{color:#3195a6;font-size:12px;font-weight:700}.param-array-format,.param-type{color:rgba(38,50,56,.4);font-size:.929em}.param-type{font-weight:400;word-break:break-all}.param-type.array::before,.param-type.tuple::before{color:#263238;font-weight:300}.param-collection-format-multi+.param-type.array::before,.param-collection-format-multi+.param-type.tuple::before{content:none}.param-type.array::before{content:"Array of "}.param-type.tuple::before{content:"Tuple "}.param-type.with-hint{margin-bottom:.4em;border-bottom:1px dotted rgba(38,50,56,.4);padding:0;cursor:help}.param-type-file{font-weight:700;text-transform:capitalize}.param-name{border-left:1px solid rgba(0,51,160,.5);box-sizing:border-box;position:relative;padding:10px 0;vertical-align:top;line-height:20px;white-space:nowrap;font-size:.929em;font-weight:400}.param-name>span::before{content:\'\';display:inline-block;width:1px;height:7px;background-color:#0033a0;margin:0 10px;vertical-align:middle}.param-name>span::after{content:\'\';position:absolute;border-top:1px solid rgba(0,51,160,.5);width:10px;left:0;top:21px}.param:first-of-type>.param-name::before{content:\'\';display:block;position:absolute;left:-1px;top:0;border-left:2px solid #fff;height:21px}.param.last>.param-name,.param:last-of-type>.param-name{position:relative}.param.last>.param-name::after,.param:last-of-type>.param-name::after{content:\'\';display:block;position:absolute;left:-2px;border-left:2px solid #fff;top:22px;background-color:#fff;bottom:0}.param-wrap:last-of-type>.param-schema{border-left-color:transparent}.param-schema .param-wrap:first-of-type .param-name::before{display:none}.param-schema.last>td{border-left:0}.param-enum{color:#263238;font-size:.95em}.param-enum::before{content:\'Valid values: \'}.param-type.array~.param-enum::before{content:\'Valid items values: \'}.param-pattern{color:#3195a6;white-space:nowrap}.param-pattern::after,.param-pattern::before{content:\'/\';margin:0 3px;font-size:1.2em;font-weight:700}.param-default,.param-example{font-size:.95em}.param-default::before{content:\'Default: \'}.param-example::before{content:\'Example: \'}.param-default-value,.param-enum-value,.param-example-value{font-family:Courier,monospace;background-color:rgba(38,50,56,.02);border:1px solid rgba(38,50,56,.1);margin:2px 3px;padding:.1em .2em .2em;border-radius:2px;color:#263238;display:inline-block;min-width:20px;text-align:center}:host{display:block}.param-schema>td{border-left:1px solid rgba(0,51,160,.5);padding:0 10px}.derived-schema{display:none}.derived-schema.active{display:block}:host.nested-schema{background-color:#fff;padding:10px 20px;position:relative;border-radius:2px}:host.nested-schema:after,:host.nested-schema:before{content:"";width:0;height:0;position:absolute;top:0;border-style:solid;border-color:#f0f0f0 transparent transparent;border-width:10px 15px 0;margin-left:-7.5px}:host.nested-schema:before{left:10%}:host.nested-schema:after{right:10%}:host.nested-schema .param:first-of-type>.param-name:before,:host.nested-schema .param:last-of-type>.param-name:after{border-color:#fff}:host[nestodd=true]{background-color:#f0f0f0;border-radius:2px}:host[nestodd=true]:after,:host[nestodd=true]:before{border-top-color:#fff}:host[nestodd=true]>.params-wrap>.param:first-of-type>.param-name:before,:host[nestodd=true]>.params-wrap>.param:last-of-type>.param-name:after{border-color:#f0f0f0}:host[nestodd=true]>.params-wrap>.param.last>.param-name:after,:host[nestodd=true]>.params-wrap>.param:last-of-type>.param-name:after{border-color:#f0f0f0}zippy{overflow:visible}.zippy-content-wrap{padding:0}.param.complex.expanded>.param-info{border-bottom:0}.param.complex>.param-name .param-name-wrap{font-weight:700;cursor:pointer;color:#263238}.param.complex>.param-name svg{height:1.2em;width:1.2em;vertical-align:middle;transition:all .3s ease}.param.complex.expanded>.param-name svg{transform:rotateZ(-180deg)}.param.additional>.param-name{color:rgba(38,50,56,.4)}.params-wrap{width:100%}table{border-spacing:0}.params-wrap.params-array:after,.params-wrap.params-array:before{display:block;font-weight:300;color:#263238;font-size:13px;line-height:1.5}.params-wrap.params-array:after{content:"]";font-family:monospace}.params-wrap.params-array:before{content:"Array [";padding-top:1em;font-family:monospace}.params-wrap.params-array{padding-left:10px}.param-schema.param-array:before{bottom:9.75px;width:10px;border-left-style:dashed;border-bottom:1px dashed rgba(0,51,160,.5)}.params-wrap.params-array>.param-wrap:first-of-type>.param>.param-name:after{content:"";display:block;position:absolute;left:-1px;top:0;border-left:2px solid #fff;height:20px}.params-wrap>.param>.param-schema.param-array{border-left-color:transparent}.discriminator-info{margin-top:5px}.discriminator-wrap:not(.empty)>td{padding:0;position:relative}.discriminator-wrap:not(.empty)>td:before{content:"";display:block;position:absolute;left:0;top:0;border-left:1px solid rgba(0,51,160,.5);height:21px;z-index:1}li,ul{margin:0}ul{list-style:none;padding-left:1em}li:before{content:"- ";font-weight:700}.array-tuple>.tuple-item{margin-top:1.5em;display:flex}.array-tuple>.tuple-item>span{flex:0;padding:10px 15px 10px 0;font-family:monospace}.array-tuple>.tuple-item>json-schema{flex:1}.array-tuple>.tuple-item>json-schema:after,.array-tuple>.tuple-item>json-schema:before{display:none}.param-name-enumvalue{padding:2px;background-color:#e6ebf6}.param-name-enumvalue:before{content:" = "}'],
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    JsonSchema.ctorParameters = function () { return [
        { type: SpecManager, },
        { type: AppStateService, },
        { type: Renderer, },
        { type: ChangeDetectorRef, },
        { type: ElementRef, },
        { type: OptionsService, },
    ]; };
    JsonSchema.propDecorators = {
        'pointer': [{ type: Input },],
        'absolutePointer': [{ type: Input },],
        'final': [{ type: Input },],
        'nestOdd': [{ type: Input },],
        'childFor': [{ type: Input },],
        'isRequestSchema': [{ type: Input },],
    };
    return JsonSchema;
}(BaseSearchableComponent));
export { JsonSchema };
//# sourceMappingURL=json-schema.js.map