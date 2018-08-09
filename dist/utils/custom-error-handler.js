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
import { ErrorHandler, Injectable } from '@angular/core';
import { AppStateService } from '../services/app-state.service';
var CustomErrorHandler = /** @class */ (function (_super) {
    __extends(CustomErrorHandler, _super);
    function CustomErrorHandler(appState) {
        var _this = _super.call(this) || this;
        _this.appState = appState;
        return _this;
    }
    CustomErrorHandler.prototype.handleError = function (error) {
        this.appState.error.next(error && error.rejection || error);
        _super.prototype.handleError.call(this, error);
    };
    CustomErrorHandler.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CustomErrorHandler.ctorParameters = function () { return [
        { type: AppStateService, },
    ]; };
    return CustomErrorHandler;
}(ErrorHandler));
export { CustomErrorHandler };
//# sourceMappingURL=custom-error-handler.js.map