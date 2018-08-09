'use strict';
import { Injectable, ComponentRef } from '@angular/core';
var ContentProjector = /** @class */ (function () {
    function ContentProjector() {
    }
    ContentProjector.prototype.instantiateAndProject = function (componentFactory, parentView, projectedNodesOrComponents) {
        var contextInjector = parentView.parentInjector;
        var projectedNodes = [];
        var componentRefs = [];
        for (var i = 0; i < projectedNodesOrComponents.length; i++) {
            var nodeOrCompRef = projectedNodesOrComponents[i];
            if (nodeOrCompRef instanceof ComponentRef) {
                projectedNodes.push(nodeOrCompRef.location.nativeElement);
                componentRefs.push(nodeOrCompRef);
            }
            else {
                projectedNodes.push(nodeOrCompRef);
            }
        }
        var parentCompRef = parentView.createComponent(componentFactory, null, contextInjector, [projectedNodes]);
        // using private property to get view instance
        var viewContainer = parentView._view;
        var viewData = parentView._data;
        viewData.viewContainer._embeddedViews = viewData.viewContainer.embeddedViews || [];
        for (var i = 0; i < componentRefs.length; i++) {
            var compRef = componentRefs[i];
            // attach view to containter change detector
            viewData.viewContainer._embeddedViews.push(compRef.hostView._view);
            compRef.hostView.attachToViewContainerRef(viewContainer);
        }
        return parentCompRef;
    };
    ContentProjector.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ContentProjector.ctorParameters = function () { return []; };
    return ContentProjector;
}());
export { ContentProjector };
//# sourceMappingURL=content-projector.service.js.map