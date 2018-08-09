import { Injectable } from '@angular/core';
import * as Mark from 'mark.js';
import { MenuService } from './menu.service';
var ROLL_LEN = 5;
var Marker = /** @class */ (function () {
    function Marker(menu) {
        var _this = this;
        this.menu = menu;
        this.permInstances = [];
        this.rolledInstances = new Array(ROLL_LEN);
        this.currIdx = -1;
        menu.changedActiveItem.subscribe(function () {
            _this.roll();
        });
    }
    Marker.prototype.addElement = function (el) {
        this.permInstances.push(new Mark(el));
    };
    Marker.prototype.newMarkerAtMenuItem = function (idx) {
        var context = this.menu.getEl(idx);
        if (this.menu.isTagOrGroupItem(idx)) {
            context = this.menu.getTagInfoEl(idx);
        }
        var newInst = context && new Mark(context);
        if (newInst && this.term) {
            newInst.mark(this.term);
        }
        return newInst;
    };
    Marker.prototype.roll = function () {
        var newIdx = this.menu.activeIdx;
        var diff = newIdx - this.currIdx;
        this.currIdx = newIdx;
        if (diff < 0) {
            diff = -diff;
            for (var i = 0; i < Math.min(diff, ROLL_LEN); i++) {
                var prevInst = this.rolledInstances.pop();
                if (prevInst)
                    prevInst.unmark();
                var idx = newIdx - Math.floor(ROLL_LEN / 2) + i;
                var newMark = this.newMarkerAtMenuItem(idx);
                this.rolledInstances.unshift(newMark);
            }
        }
        else {
            for (var i = 0; i < Math.min(diff, ROLL_LEN); i++) {
                var oldInst = this.rolledInstances.shift();
                if (oldInst)
                    oldInst.unmark();
                var idx = newIdx + Math.floor(ROLL_LEN / 2) - i;
                var newMark = this.newMarkerAtMenuItem(idx);
                this.rolledInstances.push(newMark);
            }
        }
    };
    Marker.prototype.mark = function (term) {
        this.term = term || null;
        this.remark();
    };
    Marker.prototype.remark = function () {
        for (var _i = 0, _a = this.permInstances; _i < _a.length; _i++) {
            var marker = _a[_i];
            if (marker) {
                marker.unmark();
                if (this.term)
                    marker.mark(this.term);
            }
        }
        for (var _b = 0, _c = this.rolledInstances; _b < _c.length; _b++) {
            var marker = _c[_b];
            if (marker) {
                marker.unmark();
                if (this.term)
                    marker.mark(this.term);
            }
        }
    };
    Marker.prototype.unmark = function () {
        this.term = null;
        this.remark();
    };
    Marker.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Marker.ctorParameters = function () { return [
        { type: MenuService, },
    ]; };
    return Marker;
}());
export { Marker };
//# sourceMappingURL=marker.service.js.map