import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';
import { ElementRef, OnDestroy, OnInit } from '@angular/core';
import { OptionsService } from '../../../services/options.service';
export declare class PerfectScrollbar implements OnInit, OnDestroy {
    $element: any;
    subscription: any;
    enabled: boolean;
    constructor(elementRef: ElementRef, optionsService: OptionsService);
    update(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
