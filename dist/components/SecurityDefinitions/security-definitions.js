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
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SpecManager, BaseComponent } from '../base';
import { ComponentParser } from '../../services/component-parser.service';
var AUTH_TYPES = {
    'oauth2': 'OAuth2',
    'apiKey': 'API Key',
    'basic': 'Basic Authorization'
};
var SecurityDefinitions = /** @class */ (function (_super) {
    __extends(SecurityDefinitions, _super);
    function SecurityDefinitions(specMgr) {
        var _this = _super.call(this, specMgr) || this;
        _this.info = {};
        return _this;
    }
    SecurityDefinitions.insertTagIntoDescription = function (md) {
        if (ComponentParser.contains(md, 'security-definitions'))
            return md;
        if (/^#\s?Authentication\s*$/mi.test(md))
            return md;
        return md + '\n# Authentication \n' + ComponentParser.build('security-definitions');
    };
    SecurityDefinitions.prototype.init = function () {
        var _this = this;
        this.componentSchema = this.componentSchema.securityDefinitions;
        this.defs = Object.keys(this.componentSchema).map(function (name) {
            var details = _this.componentSchema[name];
            details._displayType = AUTH_TYPES[details.type];
            return {
                name: name,
                details: details
            };
        });
    };
    SecurityDefinitions.prototype.ngOnInit = function () {
        this.preinit();
    };
    SecurityDefinitions.decorators = [
        { type: Component, args: [{
                    selector: 'security-definitions',
                    styles: [':host{display:block}.security-definition:not(:last-of-type){border-bottom:1px solid rgba(38,50,56,.3);padding-bottom:20px}:host h2{padding-top:40px}h3{margin:1em 0;font-size:1em}:host .security-details,:host .security-scopes-details{margin-top:20px}table.details td,table.details th{font-weight:700;width:200px;max-width:50%}table.details th{text-align:left;padding:6px;text-transform:capitalize;font-weight:400}'],
                    template: '<div class="security-definition" *ngFor="let def of defs"><h2 class="sharable-header" attr.section="section/Authentication/{{def.name}}"><a class="share-link" href="#section/Authentication/{{def.name}}"></a>{{def.name}}</h2><div [innerHTML]="def.details.description | marked"></div><table class="security-details"><tr><th>Security scheme type:</th><td>{{def.details._displayType}}</td></tr><tr *ngIf="def.details.type === \'apiKey\'"><th>{{def.details.in}} parameter name:</th><td>{{def.details.name}}</td></tr><ng-template [ngIf]="def.details.type === \'oauth2\'"><tr><th>OAuth2 Flow</th><td>{{def.details.flow}}</td></tr><tr *ngIf="def.details.flow === \'implicit\' || def.details.flow === \'accessCode\'"><th>Authorization URL</th><td>{{def.details.authorizationUrl}}</td></tr><tr *ngIf="def.details.flow !== \'implicit\'"><th>Token URL</th><td>{{def.details.tokenUrl}}</td></tr></ng-template></table><ng-template [ngIf]="def.details.type === \'oauth2\'"><h3>OAuth2 Scopes</h3><table class="security-scopes-details"><tr *ngFor="let scopeName of def.details.scopes | keys"><th>{{scopeName}}</th><td>{{def.details.scopes[scopeName]}}</td></tr></table></ng-template></div>',
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    SecurityDefinitions.ctorParameters = function () { return [
        { type: SpecManager, },
    ]; };
    return SecurityDefinitions;
}(BaseComponent));
export { SecurityDefinitions };
//# sourceMappingURL=security-definitions.js.map