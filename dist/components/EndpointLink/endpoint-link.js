'use strict';
import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { SpecManager } from '../base';
import { OptionsService } from '../../services/';
import { stripTrailingSlash } from '../../utils/';
var EndpointLink = /** @class */ (function () {
    function EndpointLink(specMgr, optionsService) {
        this.specMgr = specMgr;
        this.optionsService = optionsService;
        this.expanded = false;
        this.expanded = false;
    }
    // @HostListener('click')
    EndpointLink.prototype.handleClick = function () {
        this.expanded = !this.expanded;
    };
    EndpointLink.prototype.init = function () {
        var _this = this;
        var servers = this.specMgr.schema['x-servers'];
        if (servers) {
            this.servers = servers.map(function (_a) {
                var url = _a.url, description = _a.description;
                return ({
                    description: description,
                    url: stripTrailingSlash(url.startsWith('//') ? _this.specMgr.apiProtocol + ":" + url : url)
                });
            });
        }
        else {
            this.servers = [
                {
                    description: 'Server URL',
                    url: this.getBaseUrl()
                }
            ];
        }
    };
    EndpointLink.prototype.getBaseUrl = function () {
        if (this.optionsService.options.hideHostname) {
            return '';
        }
        else {
            return this.specMgr.apiUrl;
        }
    };
    EndpointLink.prototype.ngOnInit = function () {
        this.init();
    };
    EndpointLink.decorators = [
        { type: Component, args: [{
                    selector: 'endpoint-link',
                    styles: [':host{display:block;position:relative;cursor:pointer}.operation-endpoint{padding:10px 30px 10px 20px;border-radius:4px;background-color:#222d32;display:block;font-weight:300;white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;border:1px solid transparent}.operation-endpoint>.operation-params-subheader{padding-top:1px;padding-bottom:0;margin:0;font-size:12/14em;color:#263238;vertical-align:middle;display:inline-block;border-radius:2px}.operation-api-url{color:rgba(38,50,56,.8)}.operation-api-url-path{font-family:Montserrat,sans-serif;position:relative;top:1px;color:#fff;margin-left:10px}.http-verb{background:#fff;padding:3px 10px;text-transform:uppercase;display:inline-block;margin:0}.servers-overlay{position:absolute;width:100%;z-index:100;background:#fafafa;color:#263238;box-sizing:border-box;box-shadow:4px 4px 6px rgba(0,0,0,.33);overflow:hidden;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.server-item{padding:10px}.server-item>.url{padding:5px;border:1px solid #ccc;background:#fff;word-break:break-all;color:#0033a0}.server-item:last-child{margin-bottom:0}.expand-icon{height:20px;width:20px;display:inline-block;float:right;background:#222d32;transform:rotateZ(0);transition:all .2s ease;top:15px;right:5px;position:absolute}.servers-overlay{transform:translateY(-50%) scaleY(0);transition:all .25s ease}:host.expanded>.operation-endpoint{border-color:#fafafa;border-bottom-left-radius:0;border-bottom-right-radius:0}:host.expanded .expand-icon{transform:rotateZ(180deg)}:host.expanded .servers-overlay{transform:translateY(0) scaleY(1)}.http-verb{color:#fff}.http-verb.get{background-color:#6bbd5b}.http-verb.post{background-color:#248fb2}.http-verb.put{background-color:#9b708b}.http-verb.options{background-color:#d3ca12}.http-verb.patch{background-color:#e09d43}.http-verb.delete{background-color:#e27a7a}.http-verb.basic{background-color:#999}.http-verb.link{background-color:#31bbb6}.http-verb.head{background-color:#c167e4}'],
                    template: '<div class="operation-endpoint" (click)="handleClick()"><h5 class="http-verb" [ngClass]="verb">{{verb}}</h5><span><span class="operation-api-url-path">{{path}}</span></span> <svg class="expand-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 24 24" xml:space="preserve"><polygon fill="white" points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "/></svg></div><div class="servers-overlay"><div *ngFor="let server of servers" class="server-item"><div class="description" [innerHtml]="server.description | marked"></div><div select-on-click class="url"><span class="operation-api-url">{{server.url}}</span>{{path}}</div></div></div>',
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    EndpointLink.ctorParameters = function () { return [
        { type: SpecManager, },
        { type: OptionsService, },
    ]; };
    EndpointLink.propDecorators = {
        'path': [{ type: Input },],
        'verb': [{ type: Input },],
        'expanded': [{ type: HostBinding, args: ['class.expanded',] },],
    };
    return EndpointLink;
}());
export { EndpointLink };
//# sourceMappingURL=endpoint-link.js.map