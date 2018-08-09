'use strict';
import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { debounce } from '../utils/';
var Hash = /** @class */ (function () {
    function Hash(location) {
        this.location = location;
        this.value = new BehaviorSubject(null);
        this.noEmit = false;
        this.bind();
        this.debouncedUpdate = debounce(this._update.bind(this), 100);
    }
    Hash.prototype.start = function () {
        this.value.next(this.hash);
    };
    Object.defineProperty(Hash.prototype, "hash", {
        get: function () {
            return this.location.hash;
        },
        enumerable: true,
        configurable: true
    });
    Hash.prototype.bind = function () {
        var _this = this;
        this.location.onHashChange(function () {
            if (_this.noEmit)
                return;
            _this.value.next(_this.hash);
        });
    };
    Hash.prototype.update = function (hash, rewriteHistory) {
        if (rewriteHistory === void 0) { rewriteHistory = false; }
        this.debouncedUpdate(hash, rewriteHistory);
    };
    Hash.prototype._update = function (hash, rewriteHistory) {
        var _this = this;
        if (rewriteHistory === void 0) { rewriteHistory = false; }
        if (hash == undefined)
            return;
        if (rewriteHistory) {
            window.history.replaceState(null, '', window.location.href.split('#')[0] + '#' + hash);
            return;
        }
        this.noEmit = true;
        window.location.hash = hash;
        setTimeout(function () {
            _this.noEmit = false;
        });
    };
    Hash.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Hash.ctorParameters = function () { return [
        { type: PlatformLocation, },
    ]; };
    return Hash;
}());
export { Hash };
//# sourceMappingURL=hash.service.js.map