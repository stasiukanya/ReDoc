import { OnInit, ViewContainerRef, ComponentFactoryResolver, Renderer } from '@angular/core';
import { ComponentParser, ContentProjector } from '../../../services/';
export declare class DynamicNg2Viewer implements OnInit {
    private view;
    private projector;
    private parser;
    private resolver;
    private renderer;
    html: string;
    constructor(view: ViewContainerRef, projector: ContentProjector, parser: ComponentParser, resolver: ComponentFactoryResolver, renderer: Renderer);
    ngOnInit(): void;
}
export declare class DynamicNg2Wrapper {
}
