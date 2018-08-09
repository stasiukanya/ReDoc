import { OnInit } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
import { MenuService } from '../../services/index';
export declare class OperationsList extends BaseComponent implements OnInit {
    private menu;
    pointer: string;
    tags: Array<any>;
    constructor(specMgr: SpecManager, menu: MenuService);
    init(): void;
    buildAnchor(tagId: any): string;
    trackByTagName(_: any, el: any): any;
    ngOnInit(): void;
}
