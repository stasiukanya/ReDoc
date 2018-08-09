'use strict';
import { Directive, Input, HostListener, Renderer, ElementRef } from '@angular/core';
import { Clipboard } from '../../../services/clipboard.service';
var CopyButton = /** @class */ (function () {
    function CopyButton(renderer, element) {
        this.renderer = renderer;
        this.element = element;
    }
    CopyButton.prototype.ngOnInit = function () {
        if (!Clipboard.isSupported()) {
            this.element.nativeElement.parentNode.removeChild(this.element.nativeElement);
        }
        this.renderer.setElementAttribute(this.element.nativeElement, 'data-hint', 'Copy to Clipboard!');
    };
    CopyButton.prototype.onClick = function () {
        var copied;
        if (this.copyText) {
            var text = (typeof this.copyText === 'string')
                ? this.copyText
                : JSON.stringify(this.copyText, null, 2);
            copied = Clipboard.copyCustom(text);
        }
        else {
            copied = Clipboard.copyElement(this.copyElement);
        }
        if (copied) {
            this.renderer.setElementAttribute(this.element.nativeElement, 'data-hint', 'Copied!');
        }
        else {
            var hintElem = this.hintElement || this.copyElement;
            if (!hintElem)
                return;
            this.renderer.setElementAttribute(hintElem, 'data-hint', 'Press "ctrl + c" to copy');
            this.renderer.setElementClass(hintElem, 'hint--top', true);
            this.renderer.setElementClass(hintElem, 'hint--always', true);
        }
    };
    CopyButton.prototype.onLeave = function () {
        var _this = this;
        setTimeout(function () {
            _this.renderer.setElementAttribute(_this.element.nativeElement, 'data-hint', 'Copy to Clipboard');
        }, 500);
    };
    CopyButton.decorators = [
        { type: Directive, args: [{
                    selector: '[copy-button]'
                },] },
    ];
    /** @nocollapse */
    CopyButton.ctorParameters = function () { return [
        { type: Renderer, },
        { type: ElementRef, },
    ]; };
    CopyButton.propDecorators = {
        'copyText': [{ type: Input },],
        'copyElement': [{ type: Input },],
        'hintElement': [{ type: Input },],
        'onClick': [{ type: HostListener, args: ['click',] },],
        'onLeave': [{ type: HostListener, args: ['mouseleave',] },],
    };
    return CopyButton;
}());
export { CopyButton };
//# sourceMappingURL=copy-button.directive.js.map