import { Injectable } from '@angular/core';
import { AppStateService } from './app-state.service';
import { SchemaNormalizer } from './schema-normalizer.service';
import { JsonPointer, groupBy, SpecManager, snapshot } from '../utils/';
import { operations as swaggerOperations } from '../utils/swagger-defs';
import slugify from 'slugify';
import * as lunr from 'lunr';
var index = lunr(function () {
    this.field('title', { boost: 1.5 });
    this.field('body');
    this.ref('pointer');
});
var store = {};
var SearchService = /** @class */ (function () {
    function SearchService(app, spec) {
        this.app = app;
        this.spec = spec;
        this.normalizer = new SchemaNormalizer(spec);
    }
    SearchService.prototype.ensureSearchVisible = function (containingPointers) {
        this.app.searchContainingPointers.next(containingPointers);
    };
    SearchService.prototype.indexAll = function () {
        console.time('Indexing');
        this.indexPaths(this.spec.schema);
        this.indexTags(this.spec.schema);
        this.indexDescriptionHeadings(this.spec.schema.info['x-redoc-markdown-headers']);
        console.time('Indexing end');
    };
    SearchService.prototype.search = function (q) {
        var items = {};
        var res = index.search(q).map(function (res) {
            items[res.menuId] = res;
            return store[res.ref];
        });
        var grouped = groupBy(res, 'menuId');
        return grouped;
    };
    SearchService.prototype.index = function (element) {
        // don't reindex same pointers (for discriminator)
        if (store[element.pointer])
            return;
        index.add(element);
        store[element.pointer] = element;
    };
    SearchService.prototype.indexDescriptionHeadings = function (headings) {
        var _this = this;
        if (!headings)
            return;
        Object.keys(headings).forEach(function (k) {
            var heading = headings[k];
            _this.index({
                menuId: heading.id,
                title: heading.title,
                body: heading.content,
                pointer: '/heading/' + heading.id
            });
            _this.indexDescriptionHeadings(heading.children);
        });
    };
    SearchService.prototype.indexTags = function (swagger) {
        var tags = swagger.tags;
        if (!tags)
            return;
        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
            var tag = tags_1[_i];
            if (tag['x-traitTag'])
                continue;
            var id = "tag/" + slugify(tag.name);
            this.index({
                menuId: id,
                title: tag.name,
                body: tag.description,
                pointer: id
            });
        }
    };
    SearchService.prototype.indexPaths = function (swagger) {
        var _this = this;
        var paths = swagger.paths;
        var basePtr = '#/paths';
        Object.keys(paths).forEach(function (path) {
            var opearations = paths[path];
            Object.keys(opearations).forEach(function (verb) {
                if (!swaggerOperations.has(verb))
                    return;
                var opearation = opearations[verb];
                var ptr = JsonPointer.join(basePtr, [path, verb]);
                _this.indexOperation(opearation, ptr);
            });
        });
    };
    SearchService.prototype.indexOperation = function (operation, operationPointer) {
        this.index({
            pointer: operationPointer,
            menuId: operationPointer,
            title: operation.summary,
            body: operation.description
        });
        this.indexOperationResponses(operation, operationPointer);
        this.indexOperationParameters(operation, operationPointer);
    };
    SearchService.prototype.indexOperationParameters = function (operation, operationPointer) {
        var parameters = this.spec.getOperationParams(operationPointer);
        if (!parameters)
            return;
        for (var i = 0; i < parameters.length; ++i) {
            var param = parameters[i];
            var paramPointer = JsonPointer.join(operationPointer, ['parameters', i]);
            this.index({
                pointer: paramPointer,
                menuId: operationPointer,
                title: param.in === 'body' ? '' : param.name,
                body: param.description
            });
            if (param.in === 'body') {
                this.normalizer.reset();
                this.indexSchema(param.schema, '', JsonPointer.join(paramPointer, ['schema']), operationPointer);
            }
        }
    };
    SearchService.prototype.indexOperationResponses = function (operation, operationPtr) {
        var _this = this;
        var responses = operation.responses;
        if (!responses)
            return;
        Object.keys(responses).forEach(function (code) {
            var resp = responses[code];
            var respPtr = JsonPointer.join(operationPtr, ['responses', code]);
            _this.index({
                pointer: respPtr,
                menuId: operationPtr,
                title: code,
                body: resp.description
            });
            if (resp.schema) {
                _this.normalizer.reset();
                _this.indexSchema(resp.schema, '', JsonPointer.join(respPtr, 'schema'), operationPtr);
            }
            if (resp.headers) {
                _this.indexOperationResponseHeaders(resp, respPtr, operationPtr);
            }
        });
    };
    SearchService.prototype.indexOperationResponseHeaders = function (response, responsePtr, operationPtr) {
        var _this = this;
        var headers = response.headers || [];
        Object.keys(headers).forEach(function (headerName) {
            var header = headers[headerName];
            _this.index({
                pointer: responsePtr + "/" + headerName,
                menuId: operationPtr,
                title: headerName,
                body: header.description
            });
        });
    };
    SearchService.prototype.indexSchema = function (_schema, name, absolutePointer, menuPointer, parent) {
        var _this = this;
        if (!_schema)
            return;
        var schema = _schema;
        var title = name;
        schema = this.normalizer.normalize(schema, schema._pointer || absolutePointer, { childFor: parent });
        // prevent endless discriminator recursion
        if (schema._pointer && schema._pointer === parent)
            return;
        var body = schema.description; // TODO: defaults, examples, etc...
        if (schema.type === 'array') {
            if (Array.isArray(schema.items)) {
                schema.items.map(function (itemSchema, idx) {
                    _this.indexSchema(itemSchema, title, JsonPointer.join(absolutePointer, ['items', idx]), menuPointer, parent);
                });
            }
            else {
                this.indexSchema(schema.items, title, JsonPointer.join(absolutePointer, ['items']), menuPointer, parent);
            }
            return;
        }
        if (schema.discriminator) {
            var derived = this.spec.findDerivedDefinitions(schema._pointer, schema);
            for (var _i = 0, derived_1 = derived; _i < derived_1.length; _i++) {
                var defInfo = derived_1[_i];
                var subSpec = this.spec.getDescendant(defInfo, schema);
                this.indexSchema(snapshot(subSpec), '', absolutePointer, menuPointer, schema._pointer);
            }
        }
        if (schema.type === 'string' && schema.enum) {
            body += ' ' + schema.enum.join(' ');
        }
        this.index({
            pointer: absolutePointer,
            menuId: menuPointer,
            title: title,
            body: body
        });
        if (schema.properties) {
            Object.keys(schema.properties).forEach(function (propName) {
                var propPtr = JsonPointer.join(absolutePointer, ['properties', propName]);
                var prop = schema.properties[propName];
                _this.indexSchema(prop, propName, propPtr, menuPointer, parent);
            });
        }
    };
    SearchService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SearchService.ctorParameters = function () { return [
        { type: AppStateService, },
        { type: SpecManager, },
    ]; };
    return SearchService;
}());
export { SearchService };
//# sourceMappingURL=search.service.js.map