'use strict';
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
import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isString, stringify, isBlank } from './helpers';
import { MdRenderer } from './';
import { JsonFormatter } from './JsonFormatterPipe';
import { OptionsService } from '../services/options.service';
var BaseException = /** @class */ (function () {
    function BaseException(message) {
        this.message = message;
    }
    return BaseException;
}());
var InvalidPipeArgumentException = /** @class */ (function (_super) {
    __extends(InvalidPipeArgumentException, _super);
    function InvalidPipeArgumentException(type, value) {
        return _super.call(this, "Invalid argument '" + value + "' for pipe '" + stringify(type) + "'") || this;
    }
    return InvalidPipeArgumentException;
}(BaseException));
var KeysPipe = /** @class */ (function () {
    function KeysPipe() {
    }
    KeysPipe.prototype.transform = function (value) {
        if (isBlank(value))
            return value;
        if (typeof value !== 'object') {
            throw new InvalidPipeArgumentException(KeysPipe, value);
        }
        return Object.keys(value);
    };
    KeysPipe.decorators = [
        { type: Pipe, args: [{ name: 'keys' },] },
    ];
    /** @nocollapse */
    KeysPipe.ctorParameters = function () { return []; };
    return KeysPipe;
}());
export { KeysPipe };
var MarkedPipe = /** @class */ (function () {
    function MarkedPipe(sanitizer, optionsService) {
        this.sanitizer = sanitizer;
        this.renderer = new MdRenderer(true);
        this.unstrustedSpec = !!optionsService.options.untrustedSpec;
    }
    MarkedPipe.prototype.transform = function (value) {
        if (isBlank(value))
            return value;
        if (!isString(value)) {
            throw new InvalidPipeArgumentException(MarkedPipe, value);
        }
        var res = "<span class=\"redoc-markdown-block\">" + this.renderer.renderMd(value) + "</span>";
        return this.unstrustedSpec ? res : this.sanitizer.bypassSecurityTrustHtml(res);
    };
    MarkedPipe.decorators = [
        { type: Pipe, args: [{ name: 'marked' },] },
    ];
    /** @nocollapse */
    MarkedPipe.ctorParameters = function () { return [
        { type: DomSanitizer, },
        { type: OptionsService, },
    ]; };
    return MarkedPipe;
}());
export { MarkedPipe };
var SafePipe = /** @class */ (function () {
    function SafePipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SafePipe.prototype.transform = function (value) {
        if (isBlank(value))
            return value;
        if (!isString(value)) {
            return value;
        }
        return this.sanitizer.bypassSecurityTrustHtml(value);
    };
    SafePipe.decorators = [
        { type: Pipe, args: [{ name: 'safe' },] },
    ];
    /** @nocollapse */
    SafePipe.ctorParameters = function () { return [
        { type: DomSanitizer, },
    ]; };
    return SafePipe;
}());
export { SafePipe };
var langMap = {
    'c++': 'cpp',
    'c#': 'csharp',
    'objective-c': 'objectivec',
    'shell': 'bash',
    'viml': 'vim'
};
var PrismPipe = /** @class */ (function () {
    function PrismPipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    PrismPipe.prototype.transform = function (value, args) {
        if (isBlank(args) || args.length === 0) {
            throw new BaseException('Prism pipe requires one argument');
        }
        if (isBlank(value))
            return value;
        if (!isString(value)) {
            throw new InvalidPipeArgumentException(PrismPipe, value);
        }
        var lang = args[0].toString().trim().toLowerCase();
        if (langMap[lang])
            lang = langMap[lang];
        var grammar = Prism.languages[lang];
        //fallback to clike
        if (!grammar)
            grammar = Prism.languages.clike;
        return this.sanitizer.bypassSecurityTrustHtml(Prism.highlight(value, grammar));
    };
    PrismPipe.decorators = [
        { type: Pipe, args: [{ name: 'prism' },] },
    ];
    /** @nocollapse */
    PrismPipe.ctorParameters = function () { return [
        { type: DomSanitizer, },
    ]; };
    return PrismPipe;
}());
export { PrismPipe };
var EncodeURIComponentPipe = /** @class */ (function () {
    function EncodeURIComponentPipe() {
    }
    EncodeURIComponentPipe.prototype.transform = function (value) {
        if (isBlank(value))
            return value;
        if (!isString(value)) {
            throw new InvalidPipeArgumentException(EncodeURIComponentPipe, value);
        }
        return encodeURIComponent(value);
    };
    EncodeURIComponentPipe.decorators = [
        { type: Pipe, args: [{ name: 'encodeURIComponent' },] },
    ];
    /** @nocollapse */
    EncodeURIComponentPipe.ctorParameters = function () { return []; };
    return EncodeURIComponentPipe;
}());
export { EncodeURIComponentPipe };
var COLLECTION_FORMATS = {
    csv: 'Comma Separated',
    ssv: 'Space Separated',
    tsv: 'Tab Separated',
    pipes: 'Pipe Separated'
};
var CollectionFormatPipe = /** @class */ (function () {
    function CollectionFormatPipe() {
    }
    CollectionFormatPipe.prototype.transform = function (param) {
        var format = param.collectionFormat;
        if (!format)
            format = 'csv';
        if (format === 'multi') {
            return 'Multiple ' + param.in + ' params of';
        }
        return COLLECTION_FORMATS[format];
    };
    CollectionFormatPipe.decorators = [
        { type: Pipe, args: [{ name: 'collectionFormat' },] },
    ];
    /** @nocollapse */
    CollectionFormatPipe.ctorParameters = function () { return []; };
    return CollectionFormatPipe;
}());
export { CollectionFormatPipe };
export var REDOC_PIPES = [
    MarkedPipe, SafePipe, PrismPipe, EncodeURIComponentPipe, JsonFormatter, KeysPipe, CollectionFormatPipe
];
//# sourceMappingURL=pipes.js.map