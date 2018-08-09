'use strict';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
var WarningsService = /** @class */ (function () {
    function WarningsService() {
    }
    WarningsService.hasWarnings = function () {
        return !!WarningsService._warnings.length;
    };
    WarningsService.warn = function (message) {
        WarningsService._warnings.push(message);
        WarningsService.warnings.next(WarningsService._warnings);
        console.warn(message);
    };
    WarningsService.warnings = new BehaviorSubject([]);
    WarningsService._warnings = [];
    WarningsService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    WarningsService.ctorParameters = function () { return []; };
    return WarningsService;
}());
export { WarningsService };
//# sourceMappingURL=warnings.service.js.map