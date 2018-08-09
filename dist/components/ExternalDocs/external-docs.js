'use strict';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
var ExternalDocs = /** @class */ (function () {
    function ExternalDocs() {
    }
    ExternalDocs.prototype.ngOnInit = function () {
        if (this.docs && !this.docs.description) {
            this.docs.description = 'External Docs';
        }
    };
    ExternalDocs.decorators = [
        { type: Component, args: [{
                    selector: 'redoc-externalDocs',
                    template: "<a *ngIf=\"docs\" [href]=\"docs.url\" [innerHtml]=\"docs.description | marked\"></a>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    ExternalDocs.ctorParameters = function () { return []; };
    ExternalDocs.propDecorators = {
        'docs': [{ type: Input },],
    };
    return ExternalDocs;
}());
export { ExternalDocs };
//# sourceMappingURL=external-docs.js.map