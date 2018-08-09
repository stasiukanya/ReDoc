'use strict';
var isSupported = document.queryCommandSupported && document.queryCommandSupported('copy');
var Clipboard = /** @class */ (function () {
    function Clipboard() {
    }
    Clipboard.isSupported = function () {
        return isSupported;
    };
    Clipboard.selectElement = function (element) {
        var range;
        var selection;
        if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        }
        else if (document.createRange && window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
    Clipboard.deselect = function () {
        if (document.selection) {
            document.selection.empty();
        }
        else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    };
    Clipboard.copySelected = function () {
        var result;
        try {
            result = document.execCommand('copy');
        }
        catch (err) {
            result = false;
        }
        return result;
    };
    Clipboard.copyElement = function (element) {
        Clipboard.selectElement(element);
        var res = Clipboard.copySelected();
        if (res)
            Clipboard.deselect();
        return res;
    };
    Clipboard.copyCustom = function (text) {
        var textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = '0';
        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        var res = Clipboard.copySelected();
        document.body.removeChild(textArea);
        return res;
    };
    return Clipboard;
}());
export { Clipboard };
//# sourceMappingURL=clipboard.service.js.map