'use strict';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
var AppStateService = /** @class */ (function () {
    function AppStateService() {
        this.samplesLanguage = new Subject();
        this.error = new BehaviorSubject(null);
        this.loading = new Subject();
        this.initialized = new BehaviorSubject(false);
        this.rightPanelHidden = new BehaviorSubject(false);
        this.searchContainingPointers = new BehaviorSubject([]);
    }
    AppStateService.prototype.startLoading = function () {
        this.loading.next(true);
    };
    AppStateService.prototype.stopLoading = function () {
        this.loading.next(false);
    };
    AppStateService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AppStateService.ctorParameters = function () { return []; };
    return AppStateService;
}());
export { AppStateService };
//# sourceMappingURL=app-state.service.js.map