export interface Options {
    scrollYOffset?: any;
    disableLazySchemas?: boolean;
    specUrl?: string;
    suppressWarnings?: boolean;
    hideHostname?: boolean;
    hideDownloadButton?: boolean;
    lazyRendering?: boolean;
    expandResponses?: Set<string> | 'all';
    $scrollParent?: HTMLElement | Window;
    requiredPropsFirst?: boolean;
    noAutoAuth?: boolean;
    pathInMiddlePanel?: boolean;
    untrustedSpec?: boolean;
    hideLoading?: boolean;
    spec?: any;
    ignoredHeaderParameters?: string[];
    nativeScrollbars?: boolean;
}
export declare class OptionsService {
    private _options;
    constructor();
    options: Options;
    parseOptions(el: HTMLElement): void;
    _normalizeOptions(): void;
}
