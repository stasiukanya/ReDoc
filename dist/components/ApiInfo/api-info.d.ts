import { OnInit, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SpecManager, BaseComponent } from '../base';
import { OptionsService, Marker } from '../../services/index';
export declare class ApiInfo extends BaseComponent implements OnInit {
    private optionsService;
    private sanitizer;
    info: any;
    specUrl: String | SafeResourceUrl;
    downloadFilename: string;
    hideDownloadButton: boolean;
    constructor(specMgr: SpecManager, optionsService: OptionsService, elRef: ElementRef, marker: Marker, sanitizer: DomSanitizer);
    init(): void;
    ngOnInit(): void;
}
