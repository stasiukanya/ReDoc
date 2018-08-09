export interface StringMap<T> {
    [key: string]: T;
}
export declare function stringify(obj: any): string;
export declare function isString(str: any): str is String;
export declare function isFunction(func: any): boolean;
export declare function isBlank(obj: any): boolean;
export declare function stripTrailingSlash(path: string): string;
export declare function groupBy<T>(array: T[], key: string): StringMap<T[]>;
export declare function statusCodeType(statusCode: any, defaultAsError?: boolean): string;
export declare function defaults(target: any, src: any): any;
export declare function safePush(obj: any, prop: any, val: any): void;
export declare function throttle(fn: any, threshhold: any, scope: any): () => void;
export declare function debounce(func: any, wait: any, immediate?: boolean): () => void;
export declare const isSafari: boolean;
export declare function snapshot(obj: any): any;
export declare function isJsonLike(contentType: string): boolean;
export declare function isXmlLike(contentType: string): boolean;
export declare function isTextLike(contentType: string): boolean;
export declare function getJsonLikeSample(samples?: Object): any;
export declare function getXmlLikeSample(samples?: Object): any;
export declare function getTextLikeSample(samples?: Object): any;
