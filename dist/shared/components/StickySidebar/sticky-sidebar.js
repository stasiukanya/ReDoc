'use strict';
import { Directive, ElementRef, Input } from '@angular/core';
import { BrowserDomAdapter as DOM } from '../../../utils/browser-adapter';
var StickySidebar = /** @class */ (function () {
    function StickySidebar(elementRef) {
        this.$element = elementRef.nativeElement;
        // initial styling
        DOM.setStyle(this.$element, 'position', 'absolute');
        DOM.setStyle(this.$element, 'top', '0');
        DOM.setStyle(this.$element, 'bottom', '0');
        DOM.setStyle(this.$element, 'max-height', '100%');
    }
    StickySidebar.prototype.bind = function () {
        var _this = this;
        this.cancelScrollBinding = DOM.onAndCancel(this.scrollParent, 'scroll', function () { _this.updatePosition(); });
    };
    StickySidebar.prototype.unbind = function () {
        if (this.cancelScrollBinding)
            this.cancelScrollBinding();
    };
    StickySidebar.prototype.updatePosition = function () {
        var stuck = false;
        if (this.scrollY + this.scrollYOffset() >= this.$redocEl.offsetTop && !this.disable) {
            this.stick();
            stuck = true;
        }
        else {
            this.unstick();
        }
        if (this.scrollY + window.innerHeight - this.scrollYOffset()
            >= this.$redocEl.scrollHeight && !this.disable) {
            this.stickBottom();
            stuck = true;
        }
        else {
            this.unstickBottom();
        }
        if (!stuck) {
            DOM.setStyle(this.$element, 'position', 'absolute');
        }
    };
    StickySidebar.prototype.stick = function () {
        DOM.setStyle(this.$element, 'position', 'fixed');
        DOM.setStyle(this.$element, 'top', this.scrollYOffset() + 'px');
    };
    StickySidebar.prototype.unstick = function () {
        DOM.setStyle(this.$element, 'top', '0');
    };
    StickySidebar.prototype.stickBottom = function () {
        DOM.setStyle(this.$element, 'position', 'fixed');
        var offset = this.scrollY + this.scrollParentHeight - (this.$redocEl.scrollHeight + this.$redocEl.offsetTop);
        DOM.setStyle(this.$element, 'bottom', offset + 'px');
    };
    StickySidebar.prototype.unstickBottom = function () {
        DOM.setStyle(this.$element, 'bottom', '0');
    };
    Object.defineProperty(StickySidebar.prototype, "scrollY", {
        get: function () {
            return (this.scrollParent.pageYOffset != undefined) ? this.scrollParent.pageYOffset : this.scrollParent.scrollTop;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StickySidebar.prototype, "scrollParentHeight", {
        get: function () {
            return (this.scrollParent.innerHeight != undefined) ? this.scrollParent.innerHeight : this.scrollParent.clientHeight;
        },
        enumerable: true,
        configurable: true
    });
    StickySidebar.prototype.ngOnInit = function () {
        var _this = this;
        // FIXME use more reliable code
        this.$redocEl = this.$element.offsetParent.parentNode || DOM.defaultDoc().body;
        this.bind();
        requestAnimationFrame(function () { return _this.updatePosition(); });
    };
    StickySidebar.prototype.ngOnChanges = function () {
        if (!this.$redocEl || this.disable)
            return;
        this.updatePosition();
    };
    StickySidebar.prototype.ngOnDestroy = function () {
        this.unbind();
    };
    StickySidebar.decorators = [
        { type: Directive, args: [{
                    selector: '[sticky-sidebar]'
                },] },
    ];
    /** @nocollapse */
    StickySidebar.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    StickySidebar.propDecorators = {
        'scrollParent': [{ type: Input },],
        'scrollYOffset': [{ type: Input },],
        'disable': [{ type: Input },],
    };
    return StickySidebar;
}());
export { StickySidebar };
//# sourceMappingURL=sticky-sidebar.js.map