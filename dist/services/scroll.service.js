'use strict';
import { Injectable, EventEmitter } from '@angular/core';
import { BrowserDomAdapter as DOM } from '../utils/browser-adapter';
import { OptionsService } from './options.service';
import { throttle } from '../utils/helpers';
export var INVIEW_POSITION = {
    ABOVE: 1,
    BELLOW: -1,
    INVIEW: 0
};
var ScrollService = /** @class */ (function () {
    function ScrollService(optionsService) {
        this.scroll = new EventEmitter();
        this.scrollYOffset = function () { return optionsService.options.scrollYOffset(); };
        this.$scrollParent = optionsService.options.$scrollParent || window;
        this.scroll = new EventEmitter();
        this.bind();
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }
    ScrollService.prototype.scrollY = function () {
        return (this.$scrollParent.pageYOffset != undefined) ? this.$scrollParent.pageYOffset : this.$scrollParent.scrollTop;
    };
    /* returns 1 if element if above the view, 0 if in view and -1 below the view */
    ScrollService.prototype.getElementPos = function ($el, inverted) {
        if (inverted === void 0) { inverted = false; }
        var scrollYOffset = this.scrollYOffset();
        var mul = inverted ? -1 : 1;
        if (mul * Math.floor($el.getBoundingClientRect().top) > mul * scrollYOffset) {
            return INVIEW_POSITION.ABOVE;
        }
        if (mul * $el.getBoundingClientRect().bottom <= mul * scrollYOffset) {
            return INVIEW_POSITION.BELLOW;
        }
        return INVIEW_POSITION.INVIEW;
    };
    ScrollService.prototype.scrollToPos = function (posY) {
        if (this.$scrollParent.scrollTo) {
            this.$scrollParent.scrollTo(0, Math.floor(posY));
        }
        else {
            this.$scrollParent.scrollTop = posY;
        }
    };
    ScrollService.prototype.scrollTo = function ($el, offset) {
        if (offset === void 0) { offset = 0; }
        if (!$el)
            return;
        // TODO: rewrite this to use offsetTop as more reliable solution
        var subjRect = $el.getBoundingClientRect();
        var posY = this.scrollY() + subjRect.top - this.scrollYOffset() + offset + 1;
        this.scrollToPos(posY);
        return posY;
    };
    ScrollService.prototype.saveScroll = function () {
        var $el = this._stickElement;
        if (!$el)
            return;
        var offsetParent = $el.offsetParent;
        this._savedPosition = $el.offsetTop + offsetParent.offsetTop;
    };
    ScrollService.prototype.setStickElement = function ($el) {
        this._stickElement = $el;
    };
    ScrollService.prototype.restoreScroll = function () {
        var $el = this._stickElement;
        if (!$el)
            return;
        var offsetParent = $el.offsetParent;
        var currentPosition = $el.offsetTop + offsetParent.offsetTop;
        var newY = this.scrollY() + (currentPosition - this._savedPosition);
        this.scrollToPos(newY);
    };
    ScrollService.prototype.relativeScrollPos = function ($el) {
        var subjRect = $el.getBoundingClientRect();
        return -subjRect.top + this.scrollYOffset() - 1;
    };
    ScrollService.prototype.scrollHandler = function (evt) {
        var isScrolledDown = (this.scrollY() - this.prevOffsetY > 0);
        this.prevOffsetY = this.scrollY();
        this.scroll.next({ isScrolledDown: isScrolledDown, evt: evt });
    };
    ScrollService.prototype.bind = function () {
        var _this = this;
        this.prevOffsetY = this.scrollY();
        this._cancel = DOM.onAndCancel(this.$scrollParent, 'scroll', throttle(function (evt) { _this.scrollHandler(evt); }, 100, this));
    };
    ScrollService.prototype.unbind = function () {
        this._cancel();
    };
    ScrollService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ScrollService.ctorParameters = function () { return [
        { type: OptionsService, },
    ]; };
    return ScrollService;
}());
export { ScrollService };
//# sourceMappingURL=scroll.service.js.map