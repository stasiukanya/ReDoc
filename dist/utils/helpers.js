'use strict';
export function stringify(obj) {
    return JSON.stringify(obj);
}
export function isString(str) {
    return typeof str === 'string';
}
export function isFunction(func) {
    return typeof func === 'function';
}
export function isBlank(obj) {
    return obj == undefined;
}
export function stripTrailingSlash(path) {
    return path.endsWith('/') ? path.substring(0, path.length - 1) : path;
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
export function groupBy(array, key) {
    return array.reduce(function (res, value) {
        if (hasOwnProperty.call(res, value[key])) {
            res[value[key]].push(value);
        }
        else {
            res[value[key]] = [value];
        }
        return res;
    }, {});
}
export function statusCodeType(statusCode, defaultAsError) {
    if (defaultAsError === void 0) { defaultAsError = false; }
    if (statusCode === 'default') {
        return defaultAsError ? 'error' : 'success';
    }
    if (statusCode < 100 || statusCode > 599) {
        throw new Error('invalid HTTP code');
    }
    var res = 'success';
    if (statusCode >= 300 && statusCode < 400) {
        res = 'redirect';
    }
    else if (statusCode >= 400) {
        res = 'error';
    }
    else if (statusCode < 200) {
        res = 'info';
    }
    return res;
}
export function defaults(target, src) {
    var props = Object.keys(src);
    var index = -1, length = props.length;
    while (++index < length) {
        var key = props[index];
        if (target[key] === undefined) {
            target[key] = src[key];
        }
    }
    return target;
}
export function safePush(obj, prop, val) {
    if (!obj[prop])
        obj[prop] = [];
    obj[prop].push(val);
}
// credits https://remysharp.com/2010/07/21/throttling-function-calls
export function throttle(fn, threshhold, scope) {
    threshhold = threshhold || 250;
    var last, deferTimer;
    return function () {
        var context = scope || this;
        var now = +new Date, args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        }
        else {
            last = now;
            fn.apply(context, args);
        }
    };
}
export function debounce(func, wait, immediate) {
    if (immediate === void 0) { immediate = false; }
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}
export var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0
    || (function (p) { return p.toString() === '[object SafariRemoteNotification]'; })(!window['safari']
        || safari.pushNotification);
// works only for plain objects (JSON)
export function snapshot(obj) {
    if (obj == undefined || typeof (obj) !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    var temp = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = snapshot(obj[key]);
        }
    }
    return temp;
}
export function isJsonLike(contentType) {
    return contentType.search(/json/i) !== -1;
}
export function isXmlLike(contentType) {
    return contentType.search(/xml/i) !== -1;
}
export function isTextLike(contentType) {
    return contentType.search(/text\/plain/i) !== -1;
}
export function getJsonLikeSample(samples) {
    if (samples === void 0) { samples = {}; }
    var jsonLikeKeys = Object.keys(samples).filter(isJsonLike);
    if (!jsonLikeKeys.length) {
        return false;
    }
    return samples[jsonLikeKeys[0]];
}
export function getXmlLikeSample(samples) {
    if (samples === void 0) { samples = {}; }
    var xmlLikeKeys = Object.keys(samples).filter(isXmlLike);
    if (!xmlLikeKeys.length) {
        return false;
    }
    return samples[xmlLikeKeys[0]];
}
export function getTextLikeSample(samples) {
    if (samples === void 0) { samples = {}; }
    var textLikeKeys = Object.keys(samples).filter(isTextLike);
    if (!textLikeKeys.length) {
        return false;
    }
    return samples[textLikeKeys[0]];
}
//# sourceMappingURL=helpers.js.map