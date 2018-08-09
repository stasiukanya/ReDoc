'use strict';
import { Input, HostBinding, Component } from '@angular/core';
var LoadingBar = /** @class */ (function () {
    function LoadingBar() {
        this.progress = 0;
        this.display = 'block';
    }
    LoadingBar.prototype.ngOnChanges = function (ch) {
        var _this = this;
        if (ch.progress.currentValue === 100) {
            setTimeout(function () {
                _this.display = 'none';
            }, 500);
        }
    };
    LoadingBar.decorators = [
        { type: Component, args: [{
                    selector: 'loading-bar',
                    template: "\n  <span [style.width]='progress + \"%\"'> </span>\n  ",
                    styles: [':host{position:fixed;top:0;left:0;right:0;display:block;height:5px;z-index:100}span{display:block;position:absolute;left:0;top:0;bottom:0;right:attr(progress percentage);background-color:#5f7fc3;transition:right .2s linear}']
                },] },
    ];
    /** @nocollapse */
    LoadingBar.ctorParameters = function () { return []; };
    LoadingBar.propDecorators = {
        'progress': [{ type: Input },],
        'display': [{ type: HostBinding, args: ['style.display',] },],
    };
    return LoadingBar;
}());
export { LoadingBar };
//# sourceMappingURL=loading-bar.js.map