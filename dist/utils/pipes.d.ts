import { PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MdRenderer } from './';
import { JsonFormatter } from './JsonFormatterPipe';
import { OptionsService } from '../services/options.service';
export declare class KeysPipe implements PipeTransform {
    transform(value: any): any;
}
export declare class MarkedPipe implements PipeTransform {
    private sanitizer;
    renderer: MdRenderer;
    unstrustedSpec: boolean;
    constructor(sanitizer: DomSanitizer, optionsService: OptionsService);
    transform(value: string): SafeHtml;
}
export declare class SafePipe implements PipeTransform {
    private sanitizer;
    constructor(sanitizer: DomSanitizer);
    transform(value: string | SafeHtml): SafeHtml;
}
export declare class PrismPipe implements PipeTransform {
    private sanitizer;
    constructor(sanitizer: DomSanitizer);
    transform(value: any, args: any): any;
}
export declare class EncodeURIComponentPipe implements PipeTransform {
    transform(value: string): string;
}
export declare class CollectionFormatPipe implements PipeTransform {
    transform(param: any): any;
}
export declare const REDOC_PIPES: (typeof JsonFormatter | typeof KeysPipe | typeof MarkedPipe | typeof SafePipe | typeof PrismPipe)[];
