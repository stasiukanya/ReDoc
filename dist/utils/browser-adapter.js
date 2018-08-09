var BrowserDomAdapter = /** @class */ (function () {
    function BrowserDomAdapter() {
    }
    BrowserDomAdapter.query = function (selector) { return document.querySelector(selector); };
    BrowserDomAdapter.querySelector = function (el /** TODO #9100 */, selector) {
        return el.querySelector(selector);
    };
    BrowserDomAdapter.onAndCancel = function (el /** TODO #9100 */, evt /** TODO #9100 */, listener /** TODO #9100 */) {
        el.addEventListener(evt, listener, false);
        // Needed to follow Dart's subscription semantic, until fix of
        // https://code.google.com/p/dart/issues/detail?id=17406
        return function () { el.removeEventListener(evt, listener, false); };
    };
    BrowserDomAdapter.attributeMap = function (element /** TODO #9100 */) {
        var res = new Map();
        var elAttrs = element.attributes;
        for (var i = 0; i < elAttrs.length; i++) {
            var attrib = elAttrs[i];
            res.set(attrib.name, attrib.value);
        }
        return res;
    };
    BrowserDomAdapter.setStyle = function (element /** TODO #9100 */, styleName, styleValue) {
        element.style[styleName] = styleValue;
    };
    BrowserDomAdapter.removeStyle = function (element /** TODO #9100 */, stylename) {
        element.style[stylename] = null;
    };
    BrowserDomAdapter.getStyle = function (element /** TODO #9100 */, stylename) {
        return element.style[stylename];
    };
    BrowserDomAdapter.hasStyle = function (element /** TODO #9100 */, styleName, styleValue) {
        if (styleValue === void 0) { styleValue = null; }
        var value = this.getStyle(element, styleName) || '';
        return styleValue ? value === styleValue : value.length > 0;
    };
    BrowserDomAdapter.hasAttribute = function (element /** TODO #9100 */, attribute) {
        return element.hasAttribute(attribute);
    };
    BrowserDomAdapter.getAttribute = function (element /** TODO #9100 */, attribute) {
        return element.getAttribute(attribute);
    };
    BrowserDomAdapter.defaultDoc = function () { return document; };
    return BrowserDomAdapter;
}());
export { BrowserDomAdapter };
//# sourceMappingURL=browser-adapter.js.map