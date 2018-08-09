'use strict';
import { Component, EventEmitter, ElementRef, Output, Input } from '@angular/core';
import * as DropKick from 'dropkickjs';
var DropDown = /** @class */ (function () {
    function DropDown(elem) {
        this.change = new EventEmitter();
        this.elem = elem.nativeElement;
    }
    DropDown.prototype.ngAfterContentInit = function () {
        this.inst = new DropKick(this.elem.firstElementChild, { autoWidth: true });
    };
    DropDown.prototype.onChange = function (value) {
        this.change.next(value);
    };
    DropDown.prototype.ngOnChanges = function (ch) {
        if (ch.active.currentValue) {
            this.inst && this.inst.select(ch.active.currentValue);
        }
    };
    DropDown.prototype.destroy = function () {
        this.inst.dispose();
    };
    DropDown.decorators = [
        { type: Component, args: [{
                    selector: 'drop-down',
                    template: '<select (change)="onChange($event.target.value)"><ng-content></ng-content></select>',
                    styles: [':host /deep/ .dk-select{max-width:100%;font-family:Montserrat,sans-serif;font-size:.929em;min-width:100px;width:auto}:host /deep/ .dk-selected:after{display:none}:host /deep/ .dk-selected{color:#263238;border-color:rgba(38,50,56,.5);padding:.15em 1.5em .2em .5em;border-radius:2px}:host /deep/ .dk-select-open-down .dk-selected,:host /deep/ .dk-selected:focus,:host /deep/ .dk-selected:hover{border-color:#0033a0;color:#0033a0}:host /deep/ .dk-selected:before{border-top-color:#263238;border-width:.35em .35em 0}:host /deep/ .dk-select-open-down .dk-selected:before,:host /deep/ .dk-select-open-up .dk-selected:before{border-bottom-color:#0033a0}:host /deep/ .dk-select-multi:focus .dk-select-options,:host /deep/ .dk-select-open-down .dk-select-options,:host /deep/ .dk-select-open-up .dk-select-options{border-color:rgba(38,50,56,.2)}:host /deep/ .dk-select-options .dk-option-highlight{background:#fff}:host /deep/ .dk-select-options{margin-top:.2em;padding:0;border-radius:2px;box-shadow:0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08)!important;right:auto;min-width:100%}:host /deep/ .dk-option{color:#263238;padding:.16em .6em .2em .5em}:host /deep/ .dk-option:hover{background-color:rgba(38,50,56,.12)}:host /deep/ .dk-option:focus{background-color:rgba(38,50,56,.12)}:host /deep/ .dk-option-selected{background-color:rgba(0,0,0,.05)!important}']
                },] },
    ];
    /** @nocollapse */
    DropDown.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    DropDown.propDecorators = {
        'change': [{ type: Output },],
        'active': [{ type: Input },],
    };
    return DropDown;
}());
export { DropDown };
//# sourceMappingURL=drop-down.js.map