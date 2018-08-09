import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export declare class WarningsService {
    static warnings: BehaviorSubject<string[]>;
    private static _warnings;
    static hasWarnings(): boolean;
    static warn(message: string): void;
}
