'use strict';
import { Injectable } from '@angular/core';
import * as JsonSchemaRefParser from 'json-schema-ref-parser';
import { JsonPointer } from './JsonPointer';
import { parse as urlParse, resolve as urlResolve } from 'url';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdRenderer } from './md-renderer';
import { snapshot } from './helpers';
import { OptionsService } from '../services/options.service';
import { WarningsService } from '../services/warnings.service';
function getDiscriminator(obj) {
    return obj.discriminator || obj['x-extendedDiscriminator'];
}
var SpecManager = /** @class */ (function () {
    function SpecManager(optionsService) {
        this._schema = {};
        this.spec = new BehaviorSubject(null);
        this.options = optionsService.options;
    }
    SpecManager.prototype.load = function (urlOrObject) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.parser = new JsonSchemaRefParser();
            _this.parser.bundle(urlOrObject, { http: { withCredentials: false } })
                .then(function (schema) {
                if (typeof urlOrObject === 'string') {
                    _this.specUrl = urlOrObject;
                }
                _this.rawSpec = schema;
                _this._schema = snapshot(schema);
                try {
                    _this.init();
                    _this.spec.next(_this._schema);
                    resolve(_this._schema);
                }
                catch (err) {
                    reject(err);
                }
            }, function (err) { return reject(err); });
        });
        return promise;
    };
    /* calculate common used values */
    SpecManager.prototype.init = function () {
        var urlParts = this.specUrl ? urlParse(urlResolve(window.location.href, this.specUrl)) : {
            protocol: undefined,
            host: undefined
        };
        var schemes = this._schema.schemes;
        var protocol;
        if (!schemes || !schemes.length) {
            // url parser incudles ':' in protocol so remove it
            protocol = urlParts.protocol ? urlParts.protocol.slice(0, -1) : 'http';
        }
        else {
            protocol = schemes[0];
            if (protocol === 'http' && schemes.indexOf('https') >= 0) {
                protocol = 'https';
            }
        }
        var host = this._schema.host || urlParts.host;
        this.basePath = this._schema.basePath || '';
        this.apiUrl = protocol + '://' + host + this.basePath;
        this.apiProtocol = protocol;
        if (this.apiUrl.endsWith('/')) {
            this.apiUrl = this.apiUrl.substr(0, this.apiUrl.length - 1);
        }
        this.preprocess();
    };
    SpecManager.prototype.preprocess = function () {
        var mdRender = new MdRenderer();
        if (!this._schema.info) {
            throw Error('Specification Error: Required field "info" is not specified at the top level of the specification');
        }
        if (!this._schema.info.description)
            this._schema.info.description = '';
        if (this._schema.securityDefinitions && !this.options.noAutoAuth) {
            var SecurityDefinitions = require('../components/SecurityDefinitions/security-definitions').SecurityDefinitions;
            mdRender.addPreprocessor(SecurityDefinitions.insertTagIntoDescription);
        }
        this._schema.info['x-redoc-html-description'] = mdRender.renderMd(this._schema.info.description);
        this._schema.info['x-redoc-markdown-headers'] = mdRender.headings;
    };
    Object.defineProperty(SpecManager.prototype, "schema", {
        get: function () {
            return this._schema;
        },
        set: function (val) {
            this._schema = val;
            this.spec.next(this._schema);
        },
        enumerable: true,
        configurable: true
    });
    SpecManager.prototype.byPointer = function (pointer) {
        var res = null;
        if (pointer == undefined)
            return null;
        try {
            res = JsonPointer.get(this._schema, decodeURIComponent(pointer));
        }
        catch (e) {
            // if resolved from outer files simple jsonpointer.get fails to get correct schema
            if (pointer.charAt(0) !== '#')
                pointer = '#' + pointer;
            try {
                res = this.parser.$refs.get(decodeURIComponent(pointer));
            }
            catch (e) { }
        }
        return res;
    };
    SpecManager.prototype.resolveRefs = function (obj) {
        var _this = this;
        Object.keys(obj).forEach(function (key) {
            if (obj[key].$ref) {
                var resolved = _this.byPointer(obj[key].$ref);
                resolved._pointer = obj[key].$ref;
                obj[key] = resolved;
            }
        });
        return obj;
    };
    SpecManager.prototype.getOperationParams = function (operationPtr) {
        /* inject JsonPointer into array elements */
        function injectPointers(array, root) {
            if (!Array.isArray(array)) {
                throw new Error("parameters must be an array. Got " + typeof array + " at " + root);
            }
            return array.map(function (element, idx) {
                element._pointer = JsonPointer.join(root, idx);
                return element;
            });
        }
        // accept pointer directly to parameters as well
        if (JsonPointer.baseName(operationPtr) === 'parameters') {
            operationPtr = JsonPointer.dirName(operationPtr);
        }
        //get path params
        var pathParamsPtr = JsonPointer.join(JsonPointer.dirName(operationPtr), ['parameters']);
        var pathParams = this.byPointer(pathParamsPtr) || [];
        var operationParamsPtr = JsonPointer.join(operationPtr, ['parameters']);
        var operationParams = this.byPointer(operationParamsPtr) || [];
        var operationParamNames = {};
        operationParams.forEach(function (param) { return operationParamNames[param.name] = true; });
        // filter out path params overriden by operation ones with the same name
        pathParams = pathParams.filter(function (pathParam) { return !operationParamNames[pathParam.name]; });
        pathParams = injectPointers(pathParams, pathParamsPtr);
        operationParams = injectPointers(operationParams, operationParamsPtr);
        // resolve references
        operationParams = this.resolveRefs(operationParams);
        pathParams = this.resolveRefs(pathParams);
        return operationParams.concat(pathParams);
    };
    SpecManager.prototype.getTagsMap = function () {
        var tags = this._schema.tags || [];
        var tagsMap = {};
        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
            var tag = tags_1[_i];
            tagsMap[tag.name] = {
                description: tag.description,
                'x-traitTag': tag['x-traitTag'] || false
            };
        }
        return tagsMap;
    };
    SpecManager.prototype.findDerivedDefinitions = function (defPointer, schema) {
        var _this = this;
        var definition = schema || this.byPointer(defPointer);
        if (!definition)
            throw new Error("Can't load schema at " + defPointer);
        if (!definition.discriminator && !definition['x-extendedDiscriminator'])
            return [];
        if (defPointer === undefined)
            return [];
        var globalDefs = this._schema.definitions || {};
        var res = [];
        // from the spec: When used, the value MUST be the name of this schema or any schema that inherits it.
        // but most of people use it as an abstract class so here is workaround to allow using it other way
        // check if parent definition name is in the enum of possible values
        if (definition.discriminator) {
            var prop = definition.properties[definition.discriminator];
            if (prop && prop.enum && prop.enum.indexOf(JsonPointer.baseName(defPointer)) > -1) {
                res.push({
                    name: JsonPointer.baseName(defPointer),
                    $ref: defPointer
                });
            }
        }
        var extendedDiscriminatorProp = definition['x-extendedDiscriminator'];
        var pointers;
        if (definition['x-derived-from']) {
            // support inherited discriminator o_O
            var derivedDiscriminator = definition['x-derived-from'].filter(function (ptr) {
                if (!ptr)
                    return false;
                var def = _this.byPointer(ptr);
                return def && def.discriminator;
            });
            pointers = [defPointer].concat(derivedDiscriminator);
        }
        else {
            pointers = [defPointer];
        }
        for (var _i = 0, _a = Object.keys(globalDefs); _i < _a.length; _i++) {
            var defName = _a[_i];
            var def = globalDefs[defName];
            if (!def.allOf &&
                !def['x-derived-from'])
                continue;
            var subTypes = def['x-derived-from'] ||
                def.allOf.map(function (subType) { return subType._pointer || subType.$ref; });
            var idx = -1;
            var _loop_1 = function (ptr) {
                idx = subTypes.findIndex(function (ref) { return ptr && ref === ptr; });
                if (idx >= 0)
                    return "break";
            };
            for (var _b = 0, pointers_1 = pointers; _b < pointers_1.length; _b++) {
                var ptr = pointers_1[_b];
                var state_1 = _loop_1(ptr);
                if (state_1 === "break")
                    break;
            }
            if (idx < 0)
                continue;
            var derivedName = void 0;
            if (extendedDiscriminatorProp) {
                var subDefs = def.allOf || [];
                for (var _c = 0, subDefs_1 = subDefs; _c < subDefs_1.length; _c++) {
                    var def_1 = subDefs_1[_c];
                    var prop = def_1.properties && def_1.properties[extendedDiscriminatorProp];
                    if (prop && prop.enum && prop.enum.length === 1) {
                        derivedName = prop.enum[0];
                        break;
                    }
                }
                if (derivedName == undefined) {
                    WarningsService.warn("Incorrect usage of x-extendedDiscriminator at " + defPointer + ": "
                        + ("can't find corresponding enum with single value in definition \"" + defName + "\""));
                    continue;
                }
            }
            else {
                derivedName = defName;
            }
            res.push({ name: derivedName, $ref: "#/definitions/" + defName });
        }
        return res;
    };
    SpecManager.prototype.getDescendant = function (descendant, componentSchema) {
        var res;
        if (!getDiscriminator(componentSchema) && componentSchema.allOf) {
            // discriminator inherited from parents
            // only one discriminator and only one level of inheritence is supported at the moment
            res = Object.assign({}, componentSchema);
            var idx = res.allOf.findIndex(function (subSpec) { return !!getDiscriminator(subSpec); });
            res.allOf[idx] = this.byPointer(descendant.$ref);
        }
        else {
            // this.pointer = activeDescendant.$ref;
            res = this.byPointer(descendant.$ref);
        }
        return res;
    };
    SpecManager.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SpecManager.ctorParameters = function () { return [
        { type: OptionsService, },
    ]; };
    return SpecManager;
}());
export { SpecManager };
//# sourceMappingURL=spec-manager.js.map