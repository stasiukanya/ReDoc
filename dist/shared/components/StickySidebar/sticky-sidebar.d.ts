import { ElementRef, OnInit, OnDestroy, OnChanges } from '@angular/core';
export declare class StickySidebar implements OnInit, OnDestroy, OnChanges {
    $element: any;
    cancelScrollBinding: any;
    $redocEl: any;
    scrollParent: any;
    scrollYOffset: any;
    disable: any;
    constructor(elementRef: ElementRef);
    bind(): void;
    unbind(): void;
    updatePosition(): void;
    stick(): void;
    unstick(): void;
    stickBottom(): void;
    unstickBottom(): void;
    readonly scrollY: any;
    readonly scrollParentHeight: any;
    ngOnInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
}
