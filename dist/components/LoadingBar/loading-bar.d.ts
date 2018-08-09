import { OnChanges } from '@angular/core';
export declare class LoadingBar implements OnChanges {
    progress: number;
    display: string;
    ngOnChanges(ch: any): void;
}
