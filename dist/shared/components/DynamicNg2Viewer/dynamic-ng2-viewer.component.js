'use strict';
import { Component, Input, ViewContainerRef, ComponentFactoryResolver, Renderer } from '@angular/core';
import { ComponentParser, ContentProjector } from '../../../services/';
var DynamicNg2Viewer = /** @class */ (function () {
    function DynamicNg2Viewer(view, projector, parser, resolver, renderer) {
        this.view = view;
        this.projector = projector;
        this.parser = parser;
        this.resolver = resolver;
        this.renderer = renderer;
    }
    DynamicNg2Viewer.prototype.ngOnInit = function () {
        this.parser.setRenderer(this.renderer);
        var nodesOrComponents = this.parser.splitIntoNodesOrComponents(this.html, this.view.injector);
        var wrapperFactory = this.resolver.resolveComponentFactory(DynamicNg2Wrapper);
        var ref = this.projector.instantiateAndProject(wrapperFactory, this.view, nodesOrComponents);
        ref.changeDetectorRef.markForCheck();
    };
    DynamicNg2Viewer.decorators = [
        { type: Component, args: [{
                    selector: 'dynamic-ng2-viewer',
                    template: ''
                },] },
    ];
    /** @nocollapse */
    DynamicNg2Viewer.ctorParameters = function () { return [
        { type: ViewContainerRef, },
        { type: ContentProjector, },
        { type: ComponentParser, },
        { type: ComponentFactoryResolver, },
        { type: Renderer, },
    ]; };
    DynamicNg2Viewer.propDecorators = {
        'html': [{ type: Input },],
    };
    return DynamicNg2Viewer;
}());
export { DynamicNg2Viewer };
var DynamicNg2Wrapper = /** @class */ (function () {
    function DynamicNg2Wrapper() {
    }
    DynamicNg2Wrapper.decorators = [
        { type: Component, args: [{
                    selector: 'dynamic-ng2-wrapper',
                    template: '<ng-content></ng-content>'
                },] },
    ];
    /** @nocollapse */
    DynamicNg2Wrapper.ctorParameters = function () { return []; };
    return DynamicNg2Wrapper;
}());
export { DynamicNg2Wrapper };
//# sourceMappingURL=dynamic-ng2-viewer.component.js.map