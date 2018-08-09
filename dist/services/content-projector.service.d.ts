import { ComponentFactory, ComponentRef, ViewContainerRef } from '@angular/core';
export declare class ContentProjector {
    instantiateAndProject<T>(componentFactory: ComponentFactory<T>, parentView: ViewContainerRef, projectedNodesOrComponents: any[]): ComponentRef<T>;
}
