export declare class BrowserDomAdapter {
    static query(selector: string): any;
    static querySelector(el: any, selector: string): HTMLElement;
    static onAndCancel(el: any, evt: any, listener: any): Function;
    static attributeMap(element: any): Map<string, string>;
    static setStyle(element: any, styleName: string, styleValue: string): void;
    static removeStyle(element: any, stylename: string): void;
    static getStyle(element: any, stylename: string): string;
    static hasStyle(element: any, styleName: string, styleValue?: string): boolean;
    static hasAttribute(element: any, attribute: string): boolean;
    static getAttribute(element: any, attribute: string): string;
    static defaultDoc(): HTMLDocument;
}
