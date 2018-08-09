import { OnInit } from '@angular/core';
import { SpecManager } from '../base';
import { OptionsService } from '../../services/';
export interface ServerInfo {
    description: string;
    url: string;
}
export declare class EndpointLink implements OnInit {
    specMgr: SpecManager;
    optionsService: OptionsService;
    path: string;
    verb: string;
    apiUrl: string;
    servers: ServerInfo[];
    expanded: boolean;
    handleClick(): void;
    constructor(specMgr: SpecManager, optionsService: OptionsService);
    init(): void;
    getBaseUrl(): string;
    ngOnInit(): void;
}
