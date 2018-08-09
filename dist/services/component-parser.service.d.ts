import { Renderer, ComponentRef, Injector, ComponentFactoryResolver } from '@angular/core';
export declare type NodesOrComponents = HTMLElement | ComponentRef<any>;
export declare const COMPONENT_PARSER_ALLOWED = "COMPONENT_PARSER_ALLOWED";
export declare class ComponentParser {
    private resolver;
    private renderer;
    private allowedComponents;
    static contains(content: string, componentSelector: string): boolean;
    static build(componentSelector: any): string;
    constructor(resolver: ComponentFactoryResolver, allowedComponents: any);
    setRenderer(_renderer: Renderer): void;
    splitIntoNodesOrComponents(content: string, injector: Injector): NodesOrComponents[];
    createComponentByHtml(htmlTag: string, injector: Injector): ComponentRef<any> | null;
    private _parseHtml(htmlTag);
}
