import { PlatformLocation } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export declare class Hash {
    private location;
    value: BehaviorSubject<string>;
    private noEmit;
    private debouncedUpdate;
    constructor(location: PlatformLocation);
    start(): void;
    readonly hash: string;
    bind(): void;
    update(hash: string | null, rewriteHistory?: boolean): void;
    private _update(hash, rewriteHistory?);
}
