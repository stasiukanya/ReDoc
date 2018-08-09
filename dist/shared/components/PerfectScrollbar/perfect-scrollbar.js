import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';
import { Directive, ElementRef } from '@angular/core';
import * as PS from 'perfect-scrollbar';
import { OptionsService } from '../../../services/options.service';
var PerfectScrollbar = /** @class */ (function () {
    function PerfectScrollbar(elementRef, optionsService) {
        this.enabled = true;
        this.$element = elementRef.nativeElement;
        this.enabled = !optionsService.options.nativeScrollbars;
    }
    PerfectScrollbar.prototype.update = function () {
        if (!this.enabled)
            return;
        PS.update(this.$element);
    };
    PerfectScrollbar.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.enabled)
            return;
        requestAnimationFrame(function () {
            return PS.initialize(_this.$element, {
                wheelSpeed: 2,
                handlers: [
                    'click-rail',
                    'drag-scrollbar',
                    'keyboard',
                    'wheel',
                    'touch',
                ],
                wheelPropagation: true,
                minScrollbarLength: 20,
                suppressScrollX: true,
            });
        });
    };
    PerfectScrollbar.prototype.ngOnDestroy = function () {
        if (!this.enabled)
            return;
        PS.destroy(this.$element);
    };
    PerfectScrollbar.decorators = [
        { type: Directive, args: [{
                    selector: '[perfect-scrollbar]',
                },] },
    ];
    /** @nocollapse */
    PerfectScrollbar.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: OptionsService, },
    ]; };
    return PerfectScrollbar;
}());
export { PerfectScrollbar };
//# sourceMappingURL=perfect-scrollbar.js.map