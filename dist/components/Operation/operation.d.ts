import { OnInit } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
import { OptionsService, MenuService } from '../../services/';
import { SwaggerBodyParameter } from '../../utils/swagger-typings';
export interface OperationInfo {
    deprecated: boolean;
    verb: string;
    path: string;
    info: {
        tags: string[];
        description: string;
    };
    bodyParam: any;
    summary: string;
    anchor: string;
    externalDocs?: {
        url: string;
        description?: string;
    };
}
export declare class Operation extends BaseComponent implements OnInit {
    private optionsService;
    private menu;
    pointer: string;
    parentTagId: string;
    operationId: any;
    operation: OperationInfo;
    pathInMiddlePanel: boolean;
    constructor(specMgr: SpecManager, optionsService: OptionsService, menu: MenuService);
    init(): void;
    buildAnchor(): string;
    filterMainTags(tags: any): any;
    findBodyParam(): SwaggerBodyParameter;
    ngOnInit(): void;
}
