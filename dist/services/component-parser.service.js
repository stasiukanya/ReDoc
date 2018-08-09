'use strict';
import { Injectable, Inject, ComponentFactoryResolver } from '@angular/core';
export var COMPONENT_PARSER_ALLOWED = 'COMPONENT_PARSER_ALLOWED';
var COMPONENT_REGEXP = '^\\s*<!-- ReDoc-Inject:\\s+?{component}\\s+?-->\\s*$';
var ComponentParser = /** @class */ (function () {
    function ComponentParser(resolver, allowedComponents) {
        this.resolver = resolver;
        this.allowedComponents = allowedComponents;
    }
    ComponentParser.contains = function (content, componentSelector) {
        var regexp = new RegExp(COMPONENT_REGEXP.replace('{component}', "<" + componentSelector + ".*>"), 'mi');
        return regexp.test(content);
    };
    ComponentParser.build = function (componentSelector) {
        return "<!-- ReDoc-Inject: <" + componentSelector + "> -->";
    };
    ComponentParser.prototype.setRenderer = function (_renderer) {
        this.renderer = _renderer;
    };
    ComponentParser.prototype.splitIntoNodesOrComponents = function (content, injector) {
        var componentDefs = [];
        var match;
        var anyCompRegexp = new RegExp(COMPONENT_REGEXP.replace('{component}', '(.*?)'), 'gmi');
        while (match = anyCompRegexp.exec(content)) {
            componentDefs.push(match[1]);
        }
        var splitCompRegexp = new RegExp(COMPONENT_REGEXP.replace('{component}', '.*?'), 'mi');
        var htmlParts = content.split(splitCompRegexp);
        var res = [];
        for (var i = 0; i < htmlParts.length; i++) {
            var node = this.renderer.createElement(null, 'div');
            this.renderer.setElementProperty(node, 'innerHTML', htmlParts[i]);
            if (htmlParts[i])
                res.push(node);
            if (componentDefs[i]) {
                var componentRef = this.createComponentByHtml(componentDefs[i], injector);
                res.push(componentRef);
            }
        }
        return res;
    };
    ComponentParser.prototype.createComponentByHtml = function (htmlTag, injector) {
        var componentType = this._parseHtml(htmlTag).componentType;
        if (!componentType)
            return null;
        var factory = this.resolver.resolveComponentFactory(componentType);
        return factory.create(injector);
    };
    ComponentParser.prototype._parseHtml = function (htmlTag) {
        // TODO: for now only primitive parsing by tagname
        var match = /<([\w_-]+).*?>/.exec(htmlTag);
        if (match.length <= 1)
            return { componentType: null, options: null };
        var componentName = match[1];
        var componentType = this.allowedComponents[componentName];
        // TODO parse options
        var options = {};
        return {
            componentType: componentType,
            options: options
        };
    };
    ComponentParser.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ComponentParser.ctorParameters = function () { return [
        { type: ComponentFactoryResolver, },
        { type: undefined, decorators: [{ type: Inject, args: [COMPONENT_PARSER_ALLOWED,] },] },
    ]; };
    return ComponentParser;
}());
export { ComponentParser };
//# sourceMappingURL=component-parser.service.js.map