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
import { ElementRef, ChangeDetectorRef, Input, Component, HostBinding } from '@angular/core';
import { BaseComponent } from '../base';
import * as detectScollParent from 'scrollparent';
import { SpecManager } from '../../utils/spec-manager';
import { SearchService, OptionsService, Hash, AppStateService, SchemaHelper, MenuService, Marker } from '../../services/';
import { LazyTasksService } from '../../shared/components/LazyFor/lazy-for';
function getPreOptions() {
    return Redoc._preOptions || {};
}
var Redoc = /** @class */ (function (_super) {
    __extends(Redoc, _super);
    function Redoc(specMgr, optionsMgr, elementRef, changeDetector, appState, lazyTasksService, hash) {
        var _this = _super.call(this, specMgr) || this;
        _this.changeDetector = changeDetector;
        _this.appState = appState;
        _this.lazyTasksService = lazyTasksService;
        _this.hash = hash;
        _this.specLoading = false;
        _this.specLoadingRemove = false;
        SchemaHelper.setSpecManager(specMgr);
        // merge options passed before init
        optionsMgr.options = getPreOptions();
        _this.element = elementRef.nativeElement;
        _this.$parent = _this.element.parentNode;
        _this.$refElem = _this.element.nextElementSibling;
        //parse options (top level component doesn't support inputs)
        optionsMgr.parseOptions(_this.element);
        var scrollParent = detectScollParent(_this.element);
        if (scrollParent === (document.scrollingElement || document.documentElement))
            scrollParent = window;
        optionsMgr.options.$scrollParent = scrollParent;
        _this.options = optionsMgr.options;
        _this.lazyTasksService.allSync = !_this.options.lazyRendering;
        return _this;
    }
    Redoc.prototype.hideLoadingAnimation = function () {
        var _this = this;
        if (this.options.hideLoading) {
            return;
        }
        requestAnimationFrame(function () {
            _this.specLoadingRemove = true;
            setTimeout(function () {
                _this.specLoadingRemove = false;
                _this.specLoading = false;
            }, 400);
        });
    };
    Redoc.prototype.showLoadingAnimation = function () {
        if (this.options.hideLoading) {
            return;
        }
        this.specLoading = true;
        this.specLoadingRemove = false;
    };
    Redoc.prototype.load = function () {
        var _this = this;
        // bunlde spec directly if passsed or load by URL
        this.specMgr.load(this.options.spec || this.options.specUrl).catch(function (err) {
            throw err;
        });
        this.appState.loading.subscribe(function (loading) {
            if (loading) {
                _this.showLoadingAnimation();
            }
            else {
                _this.hideLoadingAnimation();
            }
        });
        this.specMgr.spec.subscribe(function (spec) {
            if (!spec) {
                _this.appState.startLoading();
            }
            else {
                _this.specLoaded = true;
                _this.changeDetector.markForCheck();
                _this.changeDetector.detectChanges();
                setTimeout(function () {
                    _this.hash.start();
                });
            }
        });
    };
    Redoc.prototype.ngOnInit = function () {
        var _this = this;
        this.lazyTasksService.loadProgress.subscribe(function (progress) { return _this.loadingProgress = progress; });
        this.appState.error.subscribe(function (_err) {
            if (!_err)
                return;
            _this.appState.stopLoading();
            if (_this.loadingProgress === 100)
                return;
            _this.error = _err;
            _this.changeDetector.markForCheck();
        });
        if (this.specUrl) {
            this.options.specUrl = this.specUrl;
        }
        this.load();
    };
    Redoc.prototype.ngOnDestroy = function () {
        var $clone = this.element.cloneNode();
        this.$parent.insertBefore($clone, this.$refElem);
    };
    Redoc._preOptions = {};
    Redoc.decorators = [
        { type: Component, args: [{
                    selector: 'redoc',
                    template: '<div class="redoc-error" *ngIf="error"><h1>Oops... ReDoc failed to render this spec</h1><div class="redoc-error-details">{{error.message}}</div></div><loading-bar *ngIf="options.lazyRendering" [progress]="loadingProgress"></loading-bar><div class="redoc-wrap" *ngIf="specLoaded && !error"><div class="background"><div class="background-actual"></div></div><div class="menu-content" sticky-sidebar [disable]="specLoading" [scrollParent]="options.$scrollParent" [scrollYOffset]="options.scrollYOffset"><div class="menu-header"><api-logo></api-logo><redoc-search></redoc-search></div><side-menu></side-menu></div><div class="api-content"><warnings></warnings><api-info></api-info><operations-list></operations-list><footer><div class="powered-by-badge"><a href="https://github.com/Rebilly/ReDoc" title="Swagger-generated API Reference Documentation" target="_blank">Powered by <strong>ReDoc</strong></a></div></footer></div></div>',
                    styles: ['.menu-content,.redoc-wrap,side-menu{overflow:hidden}:host{display:block;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-moz-tap-highlight-color:transparent;-ms-tap-highlight-color:transparent;-o-tap-highlight-color:transparent;tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;font-smoothing:antialiased;-webkit-osx-font-smoothing:grayscale;-moz-osx-font-smoothing:grayscale;osx-font-smoothing:grayscale;-moz-text-size-adjust:100%;-webkit-text-shadow:1px 1px 1px rgba(0,0,0,.004);-ms-text-shadow:1px 1px 1px rgba(0,0,0,.004);text-shadow:1px 1px 1px rgba(0,0,0,.004);text-rendering:optimizeSpeed!important;font-smooth:always;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;text-size-adjust:100%}.redoc-wrap{z-index:0;position:relative;font-family:Roboto,sans-serif;font-size:14px;line-height:1.5em;color:#263238}.menu-content{display:flex;flex-direction:column}[sticky-sidebar]{width:260px;background-color:#fafafa;overflow-x:hidden;transform:translateZ(0);z-index:75}@media (max-width:1000px){[sticky-sidebar]{width:100%;bottom:auto!important}}.api-content{margin-left:260px;z-index:50;position:relative;top:0}.background,.background-actual{right:0;top:0;bottom:0;position:absolute}@media (max-width:1000px){.api-content{padding-top:3em;margin-left:0}}.background{left:260px;z-index:1}.background-actual{background:#263238;left:60%}@media (max-width:1100px){.background{display:none}}.redoc-error{padding:20px;text-align:center;color:#e53935}.redoc-error>h2{color:#e53935;font-size:40px}.redoc-error-details{max-width:750px;margin:0 auto;font-size:18px}:host /deep/ .menu-item-header>span{display:inline-block;vertical-align:middle}:host /deep/ .menu-item-header>.operation-type+.menu-item-title{width:calc(100% - 32px)}:host /deep/ .menu-item-header>.operation-type{width:26px;display:inline-block;height:13px;background-color:#333;border-radius:3px;vertical-align:top;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAACgCAMAAADZ0KclAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////////VXz1bAAAAAJ0Uk5T/wDltzBKAAAA80lEQVR42uSWSwLCIAxEX+5/aa2QZBJw5UIt9QMdRqSPEAAw/TyvqzZf150NzdXL49qreXwXjeqz9bqN1tgJl/KLyaVrrL7K7gx+1vlNMqy+helOO4rfBGYZiEkq1ubQ3DeKvc97Et+d+e01vIZlLZZqb1WNJFd8ZKYsmv4Hh3H2fDgjMUI5WSExjiEZs7rEZ5T+/jQn9lhgsw53j/e9MQtxqPsbZY54M5fNl/MY/f1s7NbRSkYlYjc0KPsWMrmhIU9933ywxDiSE+upYNH8TdusUotllNvcAUzfnE/NC4OSYyklQhpdl9E4Tw0Cm4/G9xBgAO7VCkjWLOMfAAAAAElFTkSuQmCC);background-repeat:no-repeat;background-position:6px 4px;text-indent:-9000px;margin-right:6px;margin-top:2px}:host /deep/ .menu-item-header>.operation-type.get{background-position:8px -12px;background-color:#6bbd5b}:host /deep/ .menu-item-header>.operation-type.post{background-position:6px 4px;background-color:#248fb2}:host /deep/ .menu-item-header>.operation-type.put{background-position:8px -28px;background-color:#9b708b}:host /deep/ .menu-item-header>.operation-type.options{background-position:4px -148px;background-color:#d3ca12}:host /deep/ .menu-item-header>.operation-type.patch{background-position:4px -114px;background-color:#e09d43}:host /deep/ .menu-item-header>.operation-type.delete{background-position:4px -44px;background-color:#e27a7a}:host /deep/ .menu-item-header>.operation-type.basic{background-position:5px -79px;background-color:#999}:host /deep/ .menu-item-header>.operation-type.link{background-position:4px -131px;background-color:#31bbb6}:host /deep/ .menu-item-header>.operation-type.head{background-position:6px -102px;background-color:#c167e4}:host /deep/ h1{margin-top:0;font-family:Montserrat,sans-serif;font-weight:400;line-height:1.5;margin-bottom:.5em;font-size:1.85714em;color:#0033a0}:host /deep/ h2{margin-top:0;font-family:Montserrat,sans-serif;color:#263238;font-weight:400;line-height:1.5;margin-bottom:.5em;font-size:1.57143em}:host /deep/ h3{margin-top:0;font-family:Montserrat,sans-serif;color:#263238;font-weight:400;line-height:1.5;margin-bottom:.5em;font-size:1.28571em}:host /deep/ h4{margin-top:0;font-family:Montserrat,sans-serif;color:#263238;font-weight:400;line-height:1.5;margin-bottom:.5em;font-size:1.14286em}:host /deep/ h5{margin-top:0;font-family:Montserrat,sans-serif;color:#263238;font-weight:400;margin-bottom:.5em;font-size:.929em;line-height:20px}:host /deep/ p{font-family:Roboto,sans-serif;font-weight:300;margin:0 0 1em;line-height:1.5em}:host /deep/ a{text-decoration:none;color:#0033a0}:host /deep/ p>code{color:#e53935;border:1px solid rgba(38,50,56,.1)}:host /deep/ .hint--inversed:before{border-top-color:#fff}:host /deep/ .hint--inversed:after{background:#fff;color:#383838}footer,footer a{color:#fff}:host /deep/ .share-link{cursor:pointer;margin-left:-15px;padding:0;line-height:1;width:15px;display:inline-block}:host /deep/ .share-link:before{content:"";width:15px;height:15px;background-size:contain;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDEwMTAxIiBkPSJNNDU5LjcgMjMzLjRsLTkwLjUgOTAuNWMtNTAgNTAtMTMxIDUwLTE4MSAwIC03LjktNy44LTE0LTE2LjctMTkuNC0yNS44bDQyLjEtNDIuMWMyLTIgNC41LTMuMiA2LjgtNC41IDIuOSA5LjkgOCAxOS4zIDE1LjggMjcuMiAyNSAyNSA2NS42IDI0LjkgOTAuNSAwbDkwLjUtOTAuNWMyNS0yNSAyNS02NS42IDAtOTAuNSAtMjQuOS0yNS02NS41LTI1LTkwLjUgMGwtMzIuMiAzMi4yYy0yNi4xLTEwLjItNTQuMi0xMi45LTgxLjYtOC45bDY4LjYtNjguNmM1MC01MCAxMzEtNTAgMTgxIDBDNTA5LjYgMTAyLjMgNTA5LjYgMTgzLjQgNDU5LjcgMjMzLjR6TTIyMC4zIDM4Mi4ybC0zMi4yIDMyLjJjLTI1IDI0LjktNjUuNiAyNC45LTkwLjUgMCAtMjUtMjUtMjUtNjUuNiAwLTkwLjVsOTAuNS05MC41YzI1LTI1IDY1LjUtMjUgOTAuNSAwIDcuOCA3LjggMTIuOSAxNy4yIDE1LjggMjcuMSAyLjQtMS40IDQuOC0yLjUgNi44LTQuNWw0Mi4xLTQyYy01LjQtOS4yLTExLjYtMTgtMTkuNC0yNS44IC01MC01MC0xMzEtNTAtMTgxIDBsLTkwLjUgOTAuNWMtNTAgNTAtNTAgMTMxIDAgMTgxIDUwIDUwIDEzMSA1MCAxODEgMGw2OC42LTY4LjZDMjc0LjYgMzk1LjEgMjQ2LjQgMzkyLjMgMjIwLjMgMzgyLjJ6Ii8+PC9zdmc+Cg==);opacity:.5;visibility:hidden;display:inline-block;vertical-align:middle}:host /deep/ .sharable-header:hover .share-link:before,:host /deep/ .share-link:hover:before{visibility:visible}footer{position:relative;text-align:right;padding:10px 40px;font-size:15px;margin-top:-35px}footer strong{font-size:18px}:host /deep/ .redoc-markdown-block pre{font-family:Courier,monospace;white-space:pre-wrap;background-color:#263238;color:#fff;padding:12px 14px 15px;overflow-x:auto;line-height:normal;border-radius:2px;border:1px solid rgba(38,50,56,.1)}:host /deep/ .redoc-markdown-block pre code{background-color:transparent;color:#fff}:host /deep/ .redoc-markdown-block pre code:after,:host /deep/ .redoc-markdown-block pre code:before{content:none}:host /deep/ .redoc-markdown-block code{font-family:Courier,monospace;background-color:rgba(38,50,56,.04);padding:.1em .2em .2em;font-size:1em;border-radius:2px;color:#e53935;border:1px solid rgba(38,50,56,.1)}:host /deep/ .redoc-markdown-block p:last-of-type{margin-bottom:0}:host /deep/ .redoc-markdown-block blockquote{margin:0 0 1em;padding:0 15px;color:#777;border-left:4px solid #ddd}:host /deep/ .redoc-markdown-block img{max-width:100%;box-sizing:content-box}:host /deep/ .redoc-markdown-block ol,:host /deep/ .redoc-markdown-block ul{padding-left:2em;margin:0 0 1em;font-family:Roboto,sans-serif;font-weight:300;line-height:1.5em}:host /deep/ .redoc-markdown-block ol>li,:host /deep/ .redoc-markdown-block ul>li{margin:1em 0}:host /deep/ .redoc-markdown-block table{display:block;width:100%;overflow:auto;word-break:normal;word-break:keep-all;border-collapse:collapse;border-spacing:0;margin-top:.5em;margin-bottom:.5em}:host /deep/ .redoc-markdown-block table tr{background-color:#fff;border-top:1px solid #ccc}:host /deep/ .redoc-markdown-block table tr:nth-child(2n){background-color:#f8f8f8}:host /deep/ .redoc-markdown-block table td,:host /deep/ .redoc-markdown-block table th{padding:6px 13px;border:1px solid #ddd}:host /deep/ .redoc-markdown-block table th{text-align:left;font-weight:700}'],
                    providers: [
                        SpecManager,
                        MenuService,
                        SearchService,
                        LazyTasksService,
                        Marker
                    ]
                    //changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    Redoc.ctorParameters = function () { return [
        { type: SpecManager, },
        { type: OptionsService, },
        { type: ElementRef, },
        { type: ChangeDetectorRef, },
        { type: AppStateService, },
        { type: LazyTasksService, },
        { type: Hash, },
    ]; };
    Redoc.propDecorators = {
        'specUrl': [{ type: Input },],
        'specLoading': [{ type: HostBinding, args: ['class.loading',] },],
        'specLoadingRemove': [{ type: HostBinding, args: ['class.loading-remove',] },],
    };
    return Redoc;
}(BaseComponent));
export { Redoc };
//# sourceMappingURL=redoc.js.map