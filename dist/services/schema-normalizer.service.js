'use strict';
import { JsonPointer } from '../utils/JsonPointer';
import { defaults } from '../utils/helpers';
import { WarningsService } from './warnings.service';
var SchemaNormalizer = /** @class */ (function () {
    function SchemaNormalizer(_schema) {
        this._dereferencer = new SchemaDereferencer(_schema, this);
    }
    SchemaNormalizer.prototype.normalize = function (schema, ptr, opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        var hasPtr = !!schema.$ref;
        if (opts.resolved && !hasPtr)
            this._dereferencer.visit(ptr);
        if (opts.childFor)
            this._dereferencer.visit(opts.childFor);
        if (schema['x-redoc-normalized'])
            return schema;
        var res = SchemaWalker.walk(schema, ptr, function (subSchema, ptr) {
            var resolved = _this._dereferencer.dereference(subSchema, ptr);
            if (resolved.allOf) {
                resolved._pointer = resolved._pointer || ptr;
                resolved = Object.assign({}, resolved);
                AllOfMerger.merge(resolved, resolved.allOf);
            }
            return resolved;
        });
        if (opts.resolved && !hasPtr)
            this._dereferencer.exit(ptr);
        if (opts.childFor)
            this._dereferencer.exit(opts.childFor);
        res['x-redoc-normalized'] = true;
        return res;
    };
    SchemaNormalizer.prototype.reset = function () {
        this._dereferencer.reset();
    };
    return SchemaNormalizer;
}());
export { SchemaNormalizer };
var SchemaWalker = /** @class */ (function () {
    function SchemaWalker() {
    }
    SchemaWalker.walk = function (obj, pointer, visitor) {
        if (obj == undefined || typeof (obj) !== 'object') {
            return;
        }
        if (obj['x-redoc-visited']) {
            obj['x-redoc-visited'] = false;
            var res = visitor(obj, pointer);
            // circular, return only title and description
            return { title: res.title, description: res.description };
        }
        obj['x-redoc-visited'] = true;
        if (obj.properties) {
            var ptr = JsonPointer.join(pointer, ['properties']);
            SchemaWalker.walkEach(obj.properties, ptr, visitor);
        }
        if (obj.additionalProperties) {
            var ptr = JsonPointer.join(pointer, ['additionalProperties']);
            if (Array.isArray(obj.additionalProperties)) {
                SchemaWalker.walkEach(obj.additionalProperties, ptr, visitor);
            }
            else {
                var res = SchemaWalker.walk(obj.additionalProperties, ptr, visitor);
                if (res)
                    obj.additionalProperties = res;
            }
        }
        if (obj.allOf) {
            var ptr = JsonPointer.join(pointer, ['allOf']);
            SchemaWalker.walkEach(obj.allOf, ptr, visitor);
        }
        if (obj.items) {
            var ptr = JsonPointer.join(pointer, ['items']);
            if (Array.isArray(obj.items)) {
                SchemaWalker.walkEach(obj.items, ptr, visitor);
            }
            else {
                var res = SchemaWalker.walk(obj.items, ptr, visitor);
                if (res)
                    obj.items = res;
            }
        }
        obj['x-redoc-visited'] = false;
        return visitor(obj, pointer);
    };
    SchemaWalker.walkEach = function (obj, pointer, visitor) {
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var key = _a[_i];
            var ptr = JsonPointer.join(pointer, [key]);
            var res = SchemaWalker.walk(obj[key], ptr, visitor);
            if (res)
                obj[key] = res;
        }
    };
    return SchemaWalker;
}());
var AllOfMerger = /** @class */ (function () {
    function AllOfMerger() {
    }
    AllOfMerger.merge = function (into, schemas) {
        into['x-derived-from'] = [];
        var hadDiscriminator = !!into.discriminator;
        for (var i = 0; i < schemas.length; i++) {
            var subSchema = schemas[i];
            into['x-derived-from'].push(subSchema._pointer);
            AllOfMerger.checkCanMerge(subSchema, into);
            into.type = into.type || subSchema.type;
            if (into.type === 'object') {
                AllOfMerger.mergeObject(into, subSchema, i);
            }
            // don't merge _pointer
            var tmpPtr = subSchema._pointer;
            subSchema._pointer = null;
            defaults(into, subSchema);
            subSchema._pointer = tmpPtr;
        }
        if (!hadDiscriminator)
            into.discriminator = null;
        delete into.allOf;
    };
    AllOfMerger.mergeObject = function (into, subSchema, allOfNumber) {
        if (subSchema.properties) {
            into.properties = Object.assign({}, into.properties || {});
            Object.assign(into.properties, subSchema.properties);
            Object.keys(subSchema.properties).forEach(function (propName) {
                var prop = subSchema.properties[propName];
                if (!prop._pointer) {
                    var schemaPtr = subSchema._pointer || JsonPointer.join(into._pointer, ['allOf', allOfNumber]);
                    prop._pointer = prop._pointer || JsonPointer.join(schemaPtr, ['properties', propName]);
                }
            });
        }
        if (subSchema.required) {
            if (!into.required)
                into.required = [];
            (_a = into.required).push.apply(_a, subSchema.required);
        }
        var _a;
    };
    AllOfMerger.checkCanMerge = function (subSchema, into) {
        // TODO: add support for merge array schemas
        if (typeof subSchema !== 'object') {
            var errMessage = "Items of allOf should be Object: " + typeof subSchema + " found " +
                (subSchema + " at \"#" + into._pointer + "\"");
            throw new Error(errMessage);
        }
        if (into.type && subSchema.type && into.type !== subSchema.type) {
            var errMessage = "allOf merging error: schemas with different types can't be merged: " +
                ("\"" + into.type + "\" and \"" + subSchema.type + "\" at \"#" + into._pointer + "\"");
            throw new Error(errMessage);
        }
        if (into.type === 'array') {
            WarningsService.warn('allOf: subschemas with type "array" are not supported yet');
        }
        // TODO: add check if can be merged correctly (no different properties with the same name)
        // TODO: merge properties
    };
    return AllOfMerger;
}());
export { AllOfMerger };
var RefCounter = /** @class */ (function () {
    function RefCounter() {
        this._counter = {};
    }
    RefCounter.prototype.reset = function () {
        this._counter = {};
    };
    RefCounter.prototype.visit = function (ref) {
        this._counter[ref] = this._counter[ref] ? this._counter[ref] + 1 : 1;
    };
    RefCounter.prototype.exit = function (ref) {
        this._counter[ref] = this._counter[ref] && this._counter[ref] - 1;
    };
    RefCounter.prototype.visited = function (ref) {
        return !!this._counter[ref];
    };
    return RefCounter;
}());
var SchemaDereferencer = /** @class */ (function () {
    function SchemaDereferencer(_spec, normalizator) {
        this._spec = _spec;
        this.normalizator = normalizator;
        this._refCouner = new RefCounter();
    }
    SchemaDereferencer.prototype.reset = function () {
        this._refCouner.reset();
    };
    SchemaDereferencer.prototype.visit = function ($ref) {
        this._refCouner.visit($ref);
    };
    SchemaDereferencer.prototype.exit = function ($ref) {
        this._refCouner.exit($ref);
    };
    SchemaDereferencer.prototype.dereference = function (schema, pointer) {
        if (!schema || !schema.$ref)
            return schema;
        var $ref = schema.$ref;
        var resolved = this._spec.byPointer($ref);
        if (!this._refCouner.visited($ref)) {
            resolved._pointer = $ref;
        }
        else {
            // for circular referenced save only title and type
            resolved = {
                title: resolved.title,
                type: resolved.type
            };
        }
        this._refCouner.visit($ref);
        // if resolved schema doesn't have title use name from ref
        resolved.title = resolved.title || JsonPointer.baseName($ref);
        var keysCount = Object.keys(schema).filter(function (key) { return !key.startsWith('x-redoc'); }).length;
        if (keysCount > 2 || (keysCount === 2 && !schema.description)) {
            WarningsService.warn("Other properties are defined at the same level as $ref at \"#" + pointer + "\". " +
                'They are IGNORED according to the JsonSchema spec');
            resolved.description = resolved.description || schema.description;
        }
        resolved = this.normalizator.normalize(resolved, $ref);
        this._refCouner.exit($ref);
        return resolved;
    };
    return SchemaDereferencer;
}());
export { SchemaDereferencer };
//# sourceMappingURL=schema-normalizer.service.js.map