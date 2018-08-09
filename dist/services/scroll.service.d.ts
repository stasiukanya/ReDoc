import { EventEmitter } from '@angular/core';
import { OptionsService } from './options.service';
export declare const INVIEW_POSITION: {
    ABOVE: number;
    BELLOW: number;
    INVIEW: number;
};
export declare class ScrollService {
    scrollYOffset: any;
    $scrollParent: any;
    scroll: EventEmitter<{}>;
    private prevOffsetY;
    private _cancel;
    private _savedPosition;
    private _stickElement;
    constructor(optionsService: OptionsService);
    scrollY(): any;
    getElementPos($el: any, inverted?: boolean): number;
    scrollToPos(posY: number): void;
    scrollTo($el: any, offset?: number): number;
    saveScroll(): void;
    setStickElement($el: any): void;
    restoreScroll(): void;
    relativeScrollPos($el: any): number;
    scrollHandler(evt: any): void;
    bind(): void;
    unbind(): void;
}
