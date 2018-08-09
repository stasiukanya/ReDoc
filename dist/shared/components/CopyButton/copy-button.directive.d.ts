import { Renderer, ElementRef, OnInit } from '@angular/core';
export declare class CopyButton implements OnInit {
    private renderer;
    private element;
    $element: any;
    cancelScrollBinding: any;
    $redocEl: any;
    copyText: string;
    copyElement: any;
    hintElement: any;
    constructor(renderer: Renderer, element: ElementRef);
    ngOnInit(): void;
    onClick(): void;
    onLeave(): void;
}
