'use strict';
import { JsonPointer } from '../utils/JsonPointer';
import { operations as swaggerOperations, keywordTypes } from '../utils/swagger-defs';
import { WarningsService } from './warnings.service';
// global var for this module
var specMgrInstance;
var injectors = {
    notype: {
        check: function (propertySchema) { return !propertySchema.type; },
        inject: function (injectTo, propertySchema, pointer) {
            injectTo.type = SchemaHelper.detectType(propertySchema);
            propertySchema.type = injectTo.type;
            if (injectTo.type) {
                var message = "No \"type\" specified at \"" + pointer + "\". Automatically detected: \"" + injectTo.type + "\"";
                WarningsService.warn(message);
            }
        }
    },
    general: {
        check: function () { return true; },
        inject: function (injectTo, propertySchema, pointer) {
            injectTo._pointer = propertySchema._pointer || pointer;
            injectTo._displayType = propertySchema.type;
            if (propertySchema.format)
                injectTo._displayFormat = "<" + propertySchema.format + ">";
            if (propertySchema.enum) {
                injectTo.enum = propertySchema.enum.map(function (value) {
                    return { val: value, type: typeof value };
                });
                if (injectTo.enum && injectTo.enum.length === 1) {
                    injectTo._enumItem = injectTo.enum[0];
                    injectTo.enum = null;
                }
            }
        }
    },
    discriminator: {
        check: function (propertySchema) { return propertySchema.discriminator || propertySchema['x-extendedDiscriminator']; },
        inject: function (injectTo, propertySchema) {
            if (propertySchema === void 0) { propertySchema = injectTo; }
            injectTo.discriminator = propertySchema.discriminator;
            injectTo['x-extendedDiscriminator'] = propertySchema['x-extendedDiscriminator'];
        }
    },
    simpleArray: {
        check: function (propertySchema) {
            return propertySchema.type === 'array' && !Array.isArray(propertySchema.items);
        },
        inject: function (injectTo, propertySchema, propPointer) {
            if (propertySchema === void 0) { propertySchema = injectTo; }
            if (!propertySchema.items)
                propertySchema.items = {};
            if (!(SchemaHelper.detectType(propertySchema.items) === 'object')) {
                injectTo._isArray = true;
                injectTo._pointer = propertySchema.items._pointer
                    || JsonPointer.join(propertySchema._pointer || propPointer, ['items']);
                SchemaHelper.runInjectors(injectTo, propertySchema.items, propPointer);
            }
            else {
                injectors.object.inject(injectTo, propertySchema.items);
            }
            if (!injectTo.description)
                injectTo.description = propertySchema.items.description;
            injectTo._widgetType = 'array';
        }
    },
    tuple: {
        check: function (propertySchema) {
            return propertySchema.type === 'array' && Array.isArray(propertySchema.items);
        },
        inject: function (injectTo, propertySchema, propPointer) {
            if (propertySchema === void 0) { propertySchema = injectTo; }
            injectTo._isTuple = true;
            injectTo._displayType = '';
            var itemsPtr = JsonPointer.join(propertySchema._pointer || propPointer, ['items']);
            for (var i = 0; i < propertySchema.items.length; i++) {
                var itemSchema = propertySchema.items[i];
                itemSchema._pointer = itemSchema._pointer || JsonPointer.join(itemsPtr, [i.toString()]);
            }
            injectTo._widgetType = 'tuple';
        }
    },
    object: {
        check: function (propertySchema) {
            return propertySchema.type === 'object' && (propertySchema.properties ||
                typeof propertySchema.additionalProperties === 'object');
        },
        inject: function (injectTo, propertySchema) {
            if (propertySchema === void 0) { propertySchema = injectTo; }
            var baseName = propertySchema._pointer && JsonPointer.baseName(propertySchema._pointer);
            injectTo._displayType = propertySchema.title || baseName || 'object';
            injectTo._widgetType = 'object';
        }
    },
    noType: {
        check: function (propertySchema) { return !propertySchema.type; },
        inject: function (injectTo) {
            injectTo._displayType = '< anything >';
            injectTo._displayTypeHint = 'This field may contain data of any type';
            injectTo.isTrivial = true;
            injectTo._widgetType = 'trivial';
            injectTo._pointer = undefined;
        }
    },
    simpleType: {
        check: function (propertySchema) {
            if (propertySchema.type === 'object') {
                return (!propertySchema.properties || !Object.keys(propertySchema.properties).length)
                    && (typeof propertySchema.additionalProperties !== 'object');
            }
            return (propertySchema.type !== 'array') && propertySchema.type;
        },
        inject: function (injectTo, propertySchema) {
            if (propertySchema === void 0) { propertySchema = injectTo; }
            injectTo.isTrivial = true;
            if (injectTo._pointer) {
                injectTo._pointer = undefined;
                injectTo._displayType = propertySchema.title ?
                    propertySchema.title + " (" + propertySchema.type + ")" : propertySchema.type;
            }
            if (injectTo['x-example'] && !propertySchema.example) {
                injectTo.example = propertySchema['x-example'];
            }
            injectTo._widgetType = 'trivial';
        }
    },
    integer: {
        check: function (propertySchema) { return (propertySchema.type === 'integer' || propertySchema.type === 'number'); },
        inject: function (injectTo, propertySchema) {
            if (propertySchema === void 0) { propertySchema = injectTo; }
            var range = '';
            if (propertySchema.minimum != undefined && propertySchema.maximum != undefined) {
                range += propertySchema.exclusiveMinimum ? '( ' : '[ ';
                range += propertySchema.minimum;
                range += ' .. ';
                range += propertySchema.maximum;
                range += propertySchema.exclusiveMaximum ? ' )' : ' ]';
            }
            else if (propertySchema.maximum != undefined) {
                range += propertySchema.exclusiveMaximum ? '< ' : '<= ';
                range += propertySchema.maximum;
            }
            else if (propertySchema.minimum != undefined) {
                range += propertySchema.exclusiveMinimum ? '> ' : '>= ';
                range += propertySchema.minimum;
            }
            if (range) {
                injectTo._range = range;
            }
        }
    },
    string: {
        check: function (propertySchema) { return (propertySchema.type === 'string'); },
        inject: function (injectTo, propertySchema) {
            if (propertySchema === void 0) { propertySchema = injectTo; }
            var range;
            if (propertySchema.minLength != undefined && propertySchema.maxLength != undefined) {
                if (propertySchema.minLength === propertySchema.maxLength) {
                    range = propertySchema.minLength + " characters";
                }
                else {
                    range = "[ " + propertySchema.minLength + " .. " + propertySchema.maxLength + " ] characters";
                }
            }
            else if (propertySchema.maxLength != undefined) {
                range = "<= " + propertySchema.maxLength + " characters";
            }
            else if (propertySchema.minLength != undefined) {
                if (propertySchema.minLength === 1) {
                    range = 'non-empty';
                }
                else {
                    range = ">= " + propertySchema.minLength + " characters";
                }
            }
            injectTo._range = range;
        }
    },
    file: {
        check: function (propertySchema) { return (propertySchema.type === 'file'); },
        inject: function (injectTo, propertySchema, _, hostPointer) {
            if (propertySchema === void 0) { propertySchema = injectTo; }
            injectTo.isFile = true;
            var parentPtr;
            if (propertySchema.in === 'formData') {
                parentPtr = JsonPointer.dirName(hostPointer, 1);
            }
            else {
                parentPtr = JsonPointer.dirName(hostPointer, 3);
            }
            var parentParam = specMgrInstance.byPointer(parentPtr);
            var root = specMgrInstance.schema;
            injectTo._produces = parentParam && parentParam.produces || root.produces;
            injectTo._consumes = parentParam && parentParam.consumes || root.consumes;
            injectTo._widgetType = 'file';
        }
    }
};
var SchemaHelper = /** @class */ (function () {
    function SchemaHelper() {
    }
    SchemaHelper.setSpecManager = function (specMgr) {
        specMgrInstance = specMgr;
    };
    SchemaHelper.preprocess = function (schema, pointer, hostPointer) {
        //propertySchema = Object.assign({}, propertySchema);
        if (schema['x-redoc-schema-precompiled']) {
            return schema;
        }
        SchemaHelper.runInjectors(schema, schema, pointer, hostPointer);
        schema['x-redoc-schema-precompiled'] = true;
        return schema;
    };
    SchemaHelper.runInjectors = function (injectTo, schema, pointer, hostPointer) {
        for (var _i = 0, _a = Object.keys(injectors); _i < _a.length; _i++) {
            var injName = _a[_i];
            var injector = injectors[injName];
            if (injector.check(schema)) {
                injector.inject(injectTo, schema, pointer, hostPointer);
            }
        }
    };
    SchemaHelper.preprocessProperties = function (schema, pointer, opts) {
        var requiredMap = {};
        if (schema.required) {
            if (Array.isArray(schema.required)) {
                schema.required.forEach(function (prop) { return requiredMap[prop] = true; });
            }
            else {
                WarningsService.warn("required must be an array: \"" + typeof schema.required + "\" found at " + pointer);
            }
        }
        var props = schema.properties && Object.keys(schema.properties).map(function (propName) {
            var propertySchema = Object.assign({}, schema.properties[propName]);
            var propPointer = propertySchema._pointer ||
                JsonPointer.join(pointer, ['properties', propName]);
            propertySchema = SchemaHelper.preprocess(propertySchema, propPointer);
            propertySchema.name = propName;
            // stop endless discriminator recursion
            if (propertySchema._pointer === opts.childFor) {
                propertySchema._pointer = null;
            }
            propertySchema._required = !!requiredMap[propName];
            propertySchema.isDiscriminator = opts.discriminator === propName;
            return propertySchema;
        });
        props = props || [];
        if (schema.additionalProperties && (typeof schema.additionalProperties === 'object')) {
            var propsSchema = SchemaHelper.preprocessAdditionalProperties(schema, pointer);
            propsSchema._additional = true;
            props.push(propsSchema);
        }
        // filter readOnly props for request schemas
        if (opts.skipReadOnly) {
            props = props.filter(function (prop) { return !prop.readOnly; });
        }
        schema._properties = props;
    };
    SchemaHelper.preprocessAdditionalProperties = function (schema, pointer) {
        var addProps = schema.additionalProperties;
        var ptr = addProps._pointer || JsonPointer.join(pointer, ['additionalProperties']);
        var res = SchemaHelper.preprocess(addProps, ptr);
        res.name = '<Additional Properties> *';
        return res;
    };
    SchemaHelper.unwrapArray = function (schema, pointer) {
        var res = schema;
        if (schema && schema.type === 'array' && !Array.isArray(schema.items)) {
            var items = schema.items = schema.items || {};
            var ptr = items._pointer || JsonPointer.join(pointer, ['items']);
            res = Object.assign({}, items);
            res._isArray = true;
            res._pointer = ptr;
            res = SchemaHelper.unwrapArray(res, ptr);
        }
        return res;
    };
    SchemaHelper.operationSummary = function (operation) {
        return operation.summary || operation.operationId ||
            (operation.description && operation.description.substring(0, 50)) || '<no description>';
    };
    SchemaHelper.detectType = function (schema) {
        if (schema.type)
            return schema.type;
        var keywords = Object.keys(keywordTypes);
        for (var i = 0; i < keywords.length; i++) {
            var keyword = keywords[i];
            var type = keywordTypes[keyword];
            if (schema[keyword]) {
                return type;
            }
        }
    };
    SchemaHelper.getTagsWithOperations = function (schema) {
        var tags = {};
        for (var _i = 0, _a = schema.tags || []; _i < _a.length; _i++) {
            var tag = _a[_i];
            tags[tag.name] = tag;
            tag.operations = [];
        }
        var paths = schema.paths;
        for (var _b = 0, _c = Object.keys(paths); _b < _c.length; _b++) {
            var path = _c[_b];
            var operations = Object.keys(paths[path]).filter(function (k) { return swaggerOperations.has(k); });
            for (var _d = 0, operations_1 = operations; _d < operations_1.length; _d++) {
                var operation = operations_1[_d];
                var operationInfo = paths[path][operation];
                var operationTags = operationInfo.tags;
                // empty tag
                if (!(operationTags && operationTags.length)) {
                    operationTags = [''];
                }
                var operationPointer = JsonPointer.compile(['paths', path, operation]);
                for (var _e = 0, operationTags_1 = operationTags; _e < operationTags_1.length; _e++) {
                    var tagName = operationTags_1[_e];
                    var tag = tags[tagName];
                    if (!tag) {
                        tag = {
                            name: tagName,
                        };
                        tags[tagName] = tag;
                    }
                    if (tag['x-traitTag'])
                        continue;
                    if (!tag.operations)
                        tag.operations = [];
                    tag.operations.push(operationInfo);
                    operationInfo._pointer = operationPointer;
                    operationInfo.operation = operation;
                }
            }
        }
        return tags;
    };
    SchemaHelper.moveRequiredPropsFirst = function (properties, _required) {
        var required = _required || [];
        properties.sort(function (a, b) {
            if ((!a._required && b._required)) {
                return 1;
            }
            else if (a._required && !b._required) {
                return -1;
            }
            else if (a._required && b._required) {
                return required.indexOf(a.name) > required.indexOf(b.name) ? 1 : -1;
            }
            else {
                return 0;
            }
        });
    };
    return SchemaHelper;
}());
export { SchemaHelper };
//# sourceMappingURL=schema-helper.service.js.map