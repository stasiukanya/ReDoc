'use strict';
import { Component, ElementRef, ViewContainerRef, Input, ComponentFactoryResolver, Renderer } from '@angular/core';
import { JsonSchema } from './json-schema';
import { OptionsService } from '../../services/options.service';
import { SpecManager } from '../../utils/spec-manager';
var cache = {};
var JsonSchemaLazy = /** @class */ (function () {
    function JsonSchemaLazy(specMgr, location, elementRef, resolver, optionsService, _renderer) {
        this.specMgr = specMgr;
        this.location = location;
        this.elementRef = elementRef;
        this.resolver = resolver;
        this.optionsService = optionsService;
        this._renderer = _renderer;
        this.final = false;
        this.disableLazy = false;
        this.loaded = false;
        this.disableLazy = this.optionsService.options.disableLazySchemas;
    }
    JsonSchemaLazy.prototype.normalizePointer = function () {
        var schema = this.specMgr.byPointer(this.pointer);
        return schema && schema.$ref || this.pointer;
    };
    JsonSchemaLazy.prototype._loadAfterSelf = function () {
        var componentFactory = this.resolver.resolveComponentFactory(JsonSchema);
        var contextInjector = this.location.parentInjector;
        var compRef = this.location.createComponent(componentFactory, null, contextInjector, null);
        this.projectComponentInputs(compRef.instance);
        this._renderer.setElementAttribute(compRef.location.nativeElement, 'class', this.location.element.nativeElement.className);
        compRef.changeDetectorRef.detectChanges();
        this.loaded = true;
        return compRef;
    };
    JsonSchemaLazy.prototype.load = function () {
        if (this.disableLazy)
            return;
        if (this.loaded)
            return;
        if (this.pointer) {
            this._loadAfterSelf();
        }
    };
    // cache JsonSchema view
    JsonSchemaLazy.prototype.loadCached = function () {
        this.pointer = this.normalizePointer();
        if (cache[this.pointer]) {
            var compRef = cache[this.pointer];
            var $element = compRef.location.nativeElement;
            // skip caching view with descendant schemas
            // as it needs attached controller
            var hasDescendants = compRef.instance.descendants && compRef.instance.descendants.length;
            if (!this.disableLazy && (hasDescendants || compRef.instance._hasSubSchemas)) {
                this._loadAfterSelf();
                return;
            }
            insertAfter($element.cloneNode(true), this.elementRef.nativeElement);
            this.loaded = true;
        }
        else {
            cache[this.pointer] = this._loadAfterSelf();
        }
    };
    JsonSchemaLazy.prototype.projectComponentInputs = function (instance) {
        Object.assign(instance, this);
    };
    JsonSchemaLazy.prototype.ngOnInit = function () {
        if (!this.absolutePointer)
            this.absolutePointer = this.pointer;
    };
    JsonSchemaLazy.prototype.ngAfterViewInit = function () {
        if (!this.auto && !this.disableLazy)
            return;
        this.loadCached();
    };
    JsonSchemaLazy.prototype.ngOnDestroy = function () {
        // clear cache
        cache = {};
    };
    JsonSchemaLazy.decorators = [
        { type: Component, args: [{
                    selector: 'json-schema-lazy',
                    entryComponents: [JsonSchema],
                    template: '',
                    styles: [':host { display:none }']
                },] },
    ];
    /** @nocollapse */
    JsonSchemaLazy.ctorParameters = function () { return [
        { type: SpecManager, },
        { type: ViewContainerRef, },
        { type: ElementRef, },
        { type: ComponentFactoryResolver, },
        { type: OptionsService, },
        { type: Renderer, },
    ]; };
    JsonSchemaLazy.propDecorators = {
        'pointer': [{ type: Input },],
        'absolutePointer': [{ type: Input },],
        'auto': [{ type: Input },],
        'isRequestSchema': [{ type: Input },],
        'final': [{ type: Input },],
        'nestOdd': [{ type: Input },],
        'childFor': [{ type: Input },],
        'isArray': [{ type: Input },],
    };
    return JsonSchemaLazy;
}());
export { JsonSchemaLazy };
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
//# sourceMappingURL=json-schema-lazy.js.map