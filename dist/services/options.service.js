'use strict';
import { Injectable } from '@angular/core';
import { isFunction, isString } from '../utils/helpers';
import { BrowserDomAdapter as DOM } from '../utils/browser-adapter';
var defaults = {
    scrollYOffset: 0,
    disableLazySchemas: false
};
var OPTION_NAMES = new Set([
    'scrollYOffset',
    'disableLazySchemas',
    'specUrl',
    'suppressWarnings',
    'hideHostname',
    'lazyRendering',
    'expandResponses',
    'requiredPropsFirst',
    'noAutoAuth',
    'pathInMiddlePanel',
    'untrustedSpec',
    'hideLoading',
    'hideDownloadButton',
    'ignoredHeaderParameters',
    'nativeScrollbars',
]);
var OptionsService = /** @class */ (function () {
    function OptionsService() {
        this._options = defaults;
        this._normalizeOptions();
    }
    Object.defineProperty(OptionsService.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (opts) {
            this._options = Object.assign(this._options, opts);
        },
        enumerable: true,
        configurable: true
    });
    OptionsService.prototype.parseOptions = function (el) {
        var parsedOpts;
        var attributesMap = DOM.attributeMap(el);
        parsedOpts = {};
        Array.from(attributesMap.keys())
            .map(function (k) { return ({
            attrName: k,
            name: k.replace(/-(.)/g, function (_, $1) { return $1.toUpperCase(); })
        }); })
            .filter(function (option) { return OPTION_NAMES.has(option.name); })
            .forEach(function (option) {
            parsedOpts[option.name] = attributesMap.get(option.attrName);
        });
        this.options = parsedOpts;
        this._normalizeOptions();
    };
    OptionsService.prototype._normalizeOptions = function () {
        // modify scrollYOffset to always be a function
        if (!isFunction(this._options.scrollYOffset)) {
            if (isFinite(this._options.scrollYOffset)) {
                // if number specified create function that returns this value
                var numberOffset_1 = parseFloat(this._options.scrollYOffset);
                this.options.scrollYOffset = function () { return numberOffset_1; };
            }
            else {
                // if selector or node function that returns bottom offset of this node
                var el_1 = this._options.scrollYOffset;
                if (!(el_1 instanceof Node)) {
                    el_1 = DOM.query(el_1);
                }
                if (!el_1) {
                    this._options.scrollYOffset = function () { return 0; };
                }
                else {
                    this._options.scrollYOffset = function () { return el_1.offsetTop + el_1.offsetHeight; };
                }
            }
        }
        if (isString(this._options.disableLazySchemas))
            this._options.disableLazySchemas = true;
        if (isString(this._options.suppressWarnings))
            this._options.suppressWarnings = true;
        if (isString(this._options.hideHostname))
            this._options.hideHostname = true;
        if (isString(this._options.hideDownloadButton))
            this._options.hideDownloadButton = true;
        if (isString(this._options.lazyRendering))
            this._options.lazyRendering = true;
        if (isString(this._options.requiredPropsFirst))
            this._options.requiredPropsFirst = true;
        if (isString(this._options.noAutoAuth))
            this._options.noAutoAuth = true;
        if (isString(this._options.pathInMiddlePanel))
            this._options.pathInMiddlePanel = true;
        if (isString(this._options.untrustedSpec))
            this._options.untrustedSpec = true;
        if (isString(this._options.hideLoading))
            this._options.hideLoading = true;
        if (isString(this._options.nativeScrollbars))
            this._options.nativeScrollbars = true;
        if (isString(this._options.expandResponses)) {
            var str = this._options.expandResponses;
            if (str === 'all')
                return;
            this._options.expandResponses = new Set(str.split(','));
        }
    };
    OptionsService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    OptionsService.ctorParameters = function () { return []; };
    return OptionsService;
}());
export { OptionsService };
//# sourceMappingURL=options.service.js.map