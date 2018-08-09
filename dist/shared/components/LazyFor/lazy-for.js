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
import { Directive, Input, TemplateRef, ChangeDetectorRef, ViewContainerRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ScrollService } from '../../../services/scroll.service';
import { OptionsService } from '../../../services/options.service';
import { isSafari } from '../../../utils/helpers';
var LazyForRow = /** @class */ (function () {
    function LazyForRow($implicit, index, ready) {
        this.$implicit = $implicit;
        this.index = index;
        this.ready = ready;
    }
    Object.defineProperty(LazyForRow.prototype, "first", {
        get: function () { return this.index === 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LazyForRow.prototype, "even", {
        get: function () { return this.index % 2 === 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LazyForRow.prototype, "odd", {
        get: function () { return !this.even; },
        enumerable: true,
        configurable: true
    });
    return LazyForRow;
}());
export { LazyForRow };
var LazyTasksService = /** @class */ (function () {
    function LazyTasksService(optionsService) {
        this.optionsService = optionsService;
        this._tasks = [];
        this._current = 0;
        this._syncCount = 0;
        this._emptyProcessed = false;
        this.loadProgress = new BehaviorSubject(0);
        this.allSync = false;
    }
    Object.defineProperty(LazyTasksService.prototype, "processed", {
        get: function () {
            var res = this._tasks.length && (this._current >= this._tasks.length) || this._emptyProcessed;
            if (!this._tasks.length)
                this._emptyProcessed = true;
            return res;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LazyTasksService.prototype, "syncCount", {
        set: function (n) {
            this._syncCount = n;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LazyTasksService.prototype, "lazy", {
        set: function (sync) {
            this.allSync = sync;
        },
        enumerable: true,
        configurable: true
    });
    LazyTasksService.prototype.addTasks = function (tasks, callback) {
        var _this = this;
        tasks.forEach(function (task, idx) {
            var taskCopy = Object.assign({ _callback: callback, idx: idx }, task);
            _this._tasks.push(taskCopy);
        });
    };
    LazyTasksService.prototype.nextTaskSync = function () {
        var task = this._tasks[this._current];
        if (!task)
            return;
        task._callback(task.idx, true);
        this._current++;
        this.menuService.enableItem(task.flatIdx);
        this.loadProgress.next(this._current / this._tasks.length * 100);
    };
    LazyTasksService.prototype.nextTask = function () {
        var _this = this;
        requestAnimationFrame(function () {
            var task = _this._tasks[_this._current];
            if (!task)
                return;
            task._callback(task.idx, false).then(function () {
                _this._current++;
                _this.menuService.enableItem(task.flatIdx);
                setTimeout(function () { return _this.nextTask(); });
                _this.loadProgress.next(_this._current / _this._tasks.length * 100);
            }).catch(function (err) { return console.error(err); });
        });
    };
    LazyTasksService.prototype.sortTasks = function (center) {
        var idxMap = {};
        this._tasks.sort(function (a, b) {
            return Math.abs(a.flatIdx - center) - Math.abs(b.flatIdx - center);
        });
    };
    LazyTasksService.prototype.start = function (idx, menuService) {
        this.menuService = menuService;
        var syncCount = 5;
        // I know this is a bad practice to detect browsers but there is an issue in Safari only
        // http://stackoverflow.com/questions/40692365/maintaining-scroll-position-while-inserting-elements-above-glitching-only-in-sa
        if (isSafari && this.optionsService.options.$scrollParent === window) {
            syncCount = this._tasks.findIndex(function (task) { return task.flatIdx === idx; });
            syncCount += 1;
        }
        else {
            this.sortTasks(idx);
        }
        syncCount = Math.min(syncCount, this._tasks.length);
        if (this.allSync)
            syncCount = this._tasks.length;
        for (var i = this._current; i < syncCount; i++) {
            this.nextTaskSync();
        }
        if (!this._tasks.length) {
            this.loadProgress.next(100);
            return;
        }
        this.nextTask();
    };
    LazyTasksService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LazyTasksService.ctorParameters = function () { return [
        { type: OptionsService, },
    ]; };
    return LazyTasksService;
}());
export { LazyTasksService };
var LazyTasksServiceSync = /** @class */ (function (_super) {
    __extends(LazyTasksServiceSync, _super);
    function LazyTasksServiceSync(optionsService) {
        var _this = _super.call(this, optionsService) || this;
        _this.allSync = true;
        return _this;
    }
    LazyTasksServiceSync.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LazyTasksServiceSync.ctorParameters = function () { return [
        { type: OptionsService, },
    ]; };
    return LazyTasksServiceSync;
}(LazyTasksService));
export { LazyTasksServiceSync };
var LazyFor = /** @class */ (function () {
    function LazyFor(_template, cdr, _viewContainer, lazyTasks, scroll) {
        this._template = _template;
        this.cdr = cdr;
        this._viewContainer = _viewContainer;
        this.lazyTasks = lazyTasks;
        this.scroll = scroll;
        this.prevIdx = null;
    }
    LazyFor.prototype.nextIteration = function (idx, sync) {
        var _this = this;
        var view = this._viewContainer.createEmbeddedView(this._template, new LazyForRow(this.lazyForOf[idx], idx, sync), idx < this.prevIdx ? 0 : undefined);
        this.prevIdx = idx;
        view.context.index = idx;
        view.markForCheck();
        view.detectChanges();
        if (sync) {
            return Promise.resolve();
        }
        return new Promise(function (resolve) {
            requestAnimationFrame(function () {
                _this.scroll.saveScroll();
                view.context.ready = true;
                view.markForCheck();
                view.detectChanges();
                _this.scroll.restoreScroll();
                resolve();
            });
        });
    };
    LazyFor.prototype.ngOnInit = function () {
        if (!this.lazyForOf)
            return;
        this.lazyTasks.addTasks(this.lazyForOf, this.nextIteration.bind(this));
    };
    LazyFor.decorators = [
        { type: Directive, args: [{
                    selector: '[lazyFor][lazyForOf]'
                },] },
    ];
    /** @nocollapse */
    LazyFor.ctorParameters = function () { return [
        { type: TemplateRef, },
        { type: ChangeDetectorRef, },
        { type: ViewContainerRef, },
        { type: LazyTasksService, },
        { type: ScrollService, },
    ]; };
    LazyFor.propDecorators = {
        'lazyForOf': [{ type: Input },],
    };
    return LazyFor;
}());
export { LazyFor };
//# sourceMappingURL=lazy-for.js.map