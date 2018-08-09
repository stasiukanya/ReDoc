'use strict';
import { Injectable, EventEmitter } from '@angular/core';
import { ScrollService, INVIEW_POSITION } from './scroll.service';
import { WarningsService } from './warnings.service';
import { Hash } from './hash.service';
import { SpecManager } from '../utils/spec-manager';
import { SchemaHelper } from './schema-helper.service';
import { AppStateService } from './app-state.service';
import { LazyTasksService } from '../shared/components/LazyFor/lazy-for';
import slugify from 'slugify';
var CHANGE = {
    NEXT: 1,
    BACK: -1,
};
var MenuService = /** @class */ (function () {
    function MenuService(hash, tasks, scrollService, appState, specMgr) {
        var _this = this;
        this.hash = hash;
        this.tasks = tasks;
        this.scrollService = scrollService;
        this.appState = appState;
        this.specMgr = specMgr;
        this.changed = new EventEmitter();
        this.changedActiveItem = new EventEmitter();
        this.activeIdx = -1;
        this.domRoot = document;
        this.hash = hash;
        this.specMgr.spec.subscribe(function (spec) {
            if (!spec)
                return;
            _this.buildMenu();
        });
        this.subscribe();
    }
    MenuService.prototype.subscribe = function () {
        var _this = this;
        this._scrollSubscription = this.scrollService.scroll.subscribe(function (evt) {
            _this.onScroll(evt.isScrolledDown);
        });
        this._hashSubscription = this.hash.value.subscribe(function (hash) {
            _this.onHashChange(hash);
        });
        this._progressSubscription = this.tasks.loadProgress.subscribe(function (progress) {
            if (progress === 100) {
                _this.makeSureLastItemsEnabled();
            }
        });
    };
    Object.defineProperty(MenuService.prototype, "flatItems", {
        get: function () {
            if (!this._flatItems) {
                this._flatItems = this.flatMenu();
            }
            return this._flatItems;
        },
        enumerable: true,
        configurable: true
    });
    MenuService.prototype.enableItem = function (idx) {
        var item = this.flatItems[idx];
        item.ready = true;
        if (item.parent) {
            item.parent.ready = true;
            idx = item.parent.flatIdx;
        }
        // check if previous items§ can be enabled
        var prevItem = this.flatItems[idx -= 1];
        while (prevItem && (!prevItem.metadata || prevItem.metadata.type === 'heading' || !prevItem.items)) {
            prevItem.ready = true;
            prevItem = this.flatItems[idx -= 1];
        }
        this.changed.next();
    };
    MenuService.prototype.makeSureLastItemsEnabled = function () {
        var lastIdx = this.flatItems.length - 1;
        var item = this.flatItems[lastIdx];
        while (item && (!item.metadata || !item.items)) {
            item.ready = true;
            item = this.flatItems[lastIdx -= 1];
        }
    };
    MenuService.prototype.onScroll = function (isScrolledDown) {
        var stable = false;
        while (!stable) {
            if (isScrolledDown) {
                var $nextEl = this.getEl(this.activeIdx + 1);
                if (!$nextEl)
                    return;
                var nextInViewPos = this.scrollService.getElementPos($nextEl, true);
                if (nextInViewPos === INVIEW_POSITION.ABOVE) {
                    stable = this.changeActive(CHANGE.NEXT);
                    continue;
                }
            }
            var $currentEl = this.getCurrentEl();
            if (!$currentEl)
                return;
            var elementInViewPos = this.scrollService.getElementPos($currentEl);
            if (!isScrolledDown && elementInViewPos === INVIEW_POSITION.ABOVE) {
                stable = this.changeActive(CHANGE.BACK);
                continue;
            }
            stable = true;
        }
    };
    MenuService.prototype.onHashChange = function (hash) {
        if (hash == undefined)
            return;
        var activated = this.activateByHash(hash);
        if (!this.tasks.processed) {
            this.tasks.start(this.activeIdx, this);
            this.scrollService.setStickElement(this.getCurrentEl());
            if (activated)
                this.scrollToActive();
            this.appState.stopLoading();
        }
        else {
            if (activated)
                this.scrollToActive();
        }
    };
    MenuService.prototype.getEl = function (flatIdx) {
        if (flatIdx < 0)
            return null;
        if (flatIdx > this.flatItems.length - 1)
            return null;
        var currentItem = this.flatItems[flatIdx];
        if (!currentItem)
            return;
        if (currentItem.isGroup)
            currentItem = this.flatItems[flatIdx + 1];
        var selector = '';
        while (currentItem) {
            if (currentItem.id) {
                selector = "[section=\"" + currentItem.id + "\"] " + selector;
                // We only need to go up the chain for operations that
                // might have multiple tags. For headers/subheaders
                // we need to siply early terminate.
                if (!currentItem.metadata || currentItem.metadata.type === 'heading') {
                    break;
                }
            }
            currentItem = currentItem.parent;
        }
        selector = selector.trim();
        return selector ? this.domRoot.querySelector(selector) : null;
    };
    MenuService.prototype.isTagOrGroupItem = function (flatIdx) {
        var item = this.flatItems[flatIdx];
        return item && (item.isGroup || (item.metadata && item.metadata.type === 'tag'));
    };
    MenuService.prototype.getTagInfoEl = function (flatIdx) {
        if (!this.isTagOrGroupItem(flatIdx))
            return null;
        var el = this.getEl(flatIdx);
        return el && el.querySelector('.tag-info');
    };
    MenuService.prototype.getCurrentEl = function () {
        return this.getEl(this.activeIdx);
    };
    MenuService.prototype.deactivate = function (idx) {
        if (idx < 0)
            return;
        var item = this.flatItems[idx];
        item.active = false;
        while (item.parent) {
            item.parent.active = false;
            item = item.parent;
        }
    };
    MenuService.prototype.activate = function (item, force, replaceState) {
        if (force === void 0) { force = false; }
        if (replaceState === void 0) { replaceState = false; }
        if (!force && item && !item.ready)
            return;
        this.deactivate(this.activeIdx);
        this.activeIdx = item ? item.flatIdx : -1;
        if (this.activeIdx < 0) {
            this.hash.update('', replaceState);
            return;
        }
        item.active = true;
        var cItem = item;
        while (cItem.parent) {
            cItem.parent.active = true;
            cItem = cItem.parent;
        }
        this.hash.update(this.hashFor(item.id, item.metadata, item.parent && item.parent.id), replaceState);
        this.changedActiveItem.next(item);
    };
    MenuService.prototype.activateByIdx = function (idx, force, replaceState) {
        if (force === void 0) { force = false; }
        if (replaceState === void 0) { replaceState = false; }
        var item = this.flatItems[idx];
        this.activate(item, force, replaceState);
    };
    MenuService.prototype.changeActive = function (offset) {
        if (offset === void 0) { offset = 1; }
        var noChange = (this.activeIdx <= 0 && offset === -1) ||
            (this.activeIdx === this.flatItems.length - 1 && offset === 1);
        this.activateByIdx(this.activeIdx + offset, false, true);
        return noChange;
    };
    MenuService.prototype.scrollToActive = function () {
        var $el = this.getCurrentEl();
        if ($el)
            this.scrollService.scrollTo($el);
    };
    MenuService.prototype.activateByHash = function (hash) {
        if (!hash)
            return;
        var idx = 0;
        hash = hash.substr(1);
        var namespace = hash.split('/')[0];
        var ptr = decodeURIComponent(hash.substr(namespace.length + 1));
        if (namespace === 'section' || namespace === 'tag') {
            var sectionId = ptr.split('/')[0];
            ptr = ptr.substr(sectionId.length) || null;
            var searchId_1;
            if (namespace === 'section') {
                searchId_1 = hash;
            }
            else {
                searchId_1 = ptr || (namespace + '/' + sectionId);
            }
            idx = this.flatItems.findIndex(function (item) { return item.id === searchId_1; });
            if (idx < 0) {
                this.tryScrollToId(searchId_1);
                return false;
            }
        }
        else if (namespace === 'operation') {
            idx = this.flatItems.findIndex(function (item) {
                return item.metadata && item.metadata.operationId === ptr;
            });
        }
        this.activateByIdx(idx, true);
        return idx >= 0;
    };
    MenuService.prototype.tryScrollToId = function (id) {
        var $el = this.domRoot.querySelector("[section=\"" + id + "\"]");
        if ($el)
            this.scrollService.scrollTo($el);
    };
    MenuService.prototype.addMarkdownItems = function () {
        var _this = this;
        var schema = this.specMgr.schema;
        var headings = schema.info && schema.info['x-redoc-markdown-headers'] || {};
        Object.keys(headings).forEach(function (h) {
            var heading = headings[h];
            var id = 'section/' + heading.id;
            var item = {
                name: heading.title,
                id: id,
                items: null,
                metadata: {
                    type: 'heading'
                }
            };
            item.items = _this.getMarkdownSubheaders(item, heading);
            _this.items.push(item);
        });
    };
    MenuService.prototype.getMarkdownSubheaders = function (parent, parentHeading) {
        var res = [];
        Object.keys(parentHeading.children || {}).forEach(function (h) {
            var heading = parentHeading.children[h];
            var id = 'section/' + heading.id;
            var subItem = {
                name: heading.title,
                id: id,
                parent: parent,
                metadata: {
                    type: 'heading'
                }
            };
            res.push(subItem);
        });
        return res;
    };
    MenuService.prototype.getOperationsItems = function (parent, tag) {
        if (!tag.operations || !tag.operations.length)
            return null;
        var res = [];
        for (var _i = 0, _a = tag.operations; _i < _a.length; _i++) {
            var operationInfo = _a[_i];
            var subItem = {
                name: SchemaHelper.operationSummary(operationInfo),
                id: operationInfo._pointer,
                description: operationInfo.description,
                metadata: {
                    type: 'operation',
                    pointer: operationInfo._pointer,
                    operationId: operationInfo.operationId,
                    operation: operationInfo.operation,
                    deprecated: !!operationInfo.deprecated
                },
                parent: parent
            };
            res.push(subItem);
        }
        return res;
    };
    MenuService.prototype.hashFor = function (id, itemMeta, parentId) {
        if (!id)
            return null;
        if (itemMeta && itemMeta.type === 'operation') {
            if (itemMeta.operationId) {
                return 'operation/' + encodeURIComponent(itemMeta.operationId);
            }
            else {
                return parentId + encodeURIComponent(itemMeta.pointer);
            }
        }
        else {
            return id;
        }
    };
    MenuService.prototype.getTagsItems = function (parent, tagGroup) {
        var _this = this;
        if (tagGroup === void 0) { tagGroup = null; }
        var schema = this.specMgr.schema;
        var tags;
        if (!tagGroup) {
            // all tags
            tags = Object.keys(this._tagsWithOperations);
        }
        else {
            tags = tagGroup.tags;
        }
        tags = tags.map(function (k) {
            if (!_this._tagsWithOperations[k]) {
                WarningsService.warn("Non-existing tag \"" + k + "\" is added to the group \"" + tagGroup.name + "\"");
                return null;
            }
            _this._tagsWithOperations[k].used = true;
            return _this._tagsWithOperations[k];
        });
        var res = [];
        for (var _i = 0, _a = tags || []; _i < _a.length; _i++) {
            var tag = _a[_i];
            if (!tag)
                continue;
            var id = 'tag/' + slugify(tag.name);
            var item = void 0;
            // don't put empty tag into menu, instead put their operations
            if (tag.name === '') {
                var items = this.getOperationsItems(null, tag);
                res.push.apply(res, items);
                continue;
            }
            item = {
                name: tag['x-displayName'] || tag.name,
                id: id,
                description: tag.description,
                metadata: { type: 'tag', externalDocs: tag.externalDocs },
                parent: parent,
                items: null
            };
            item.items = this.getOperationsItems(item, tag);
            res.push(item);
        }
        return res;
    };
    MenuService.prototype.getTagGroupsItems = function (parent, groups) {
        var res = [];
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var group = groups_1[_i];
            var item = void 0;
            item = {
                name: group.name,
                id: null,
                description: '',
                parent: parent,
                isGroup: true,
                items: null
            };
            item.items = this.getTagsItems(item, group);
            res.push(item);
        }
        this.checkAllTagsUsedInGroups();
        return res;
    };
    MenuService.prototype.checkAllTagsUsedInGroups = function () {
        for (var _i = 0, _a = Object.keys(this._tagsWithOperations); _i < _a.length; _i++) {
            var tag = _a[_i];
            if (!this._tagsWithOperations[tag].used) {
                WarningsService.warn("Tag \"" + tag + "\" is not added to any group");
            }
        }
    };
    MenuService.prototype.buildMenu = function () {
        this._tagsWithOperations = SchemaHelper.getTagsWithOperations(this.specMgr.schema);
        this.items = this.items || [];
        this.addMarkdownItems();
        if (this.specMgr.schema['x-tagGroups']) {
            (_a = this.items).push.apply(_a, this.getTagGroupsItems(null, this.specMgr.schema['x-tagGroups']));
        }
        else {
            (_b = this.items).push.apply(_b, this.getTagsItems(null));
        }
        var _a, _b;
    };
    MenuService.prototype.flatMenu = function () {
        var menu = this.items;
        if (!menu)
            return;
        var res = [];
        var curDepth = 1;
        var recursive = function (items) {
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                res.push(item);
                item.depth = item.isGroup ? 0 : curDepth;
                item.flatIdx = res.length - 1;
                if (item.items) {
                    if (!item.isGroup)
                        curDepth++;
                    recursive(item.items);
                    if (!item.isGroup)
                        curDepth--;
                }
            }
        };
        recursive(menu);
        return res;
    };
    MenuService.prototype.getItemById = function (id) {
        return this.flatItems.find(function (item) { return item.id === id || item.id === "section/" + id; });
    };
    MenuService.prototype.destroy = function () {
        this._hashSubscription.unsubscribe();
        this._scrollSubscription.unsubscribe();
        this._progressSubscription.unsubscribe();
    };
    MenuService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    MenuService.ctorParameters = function () { return [
        { type: Hash, },
        { type: LazyTasksService, },
        { type: ScrollService, },
        { type: AppStateService, },
        { type: SpecManager, },
    ]; };
    return MenuService;
}());
export { MenuService };
//# sourceMappingURL=menu.service.js.map