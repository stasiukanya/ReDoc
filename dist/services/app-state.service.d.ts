import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export declare class AppStateService {
    samplesLanguage: Subject<string>;
    error: BehaviorSubject<any>;
    loading: Subject<boolean>;
    initialized: BehaviorSubject<any>;
    rightPanelHidden: BehaviorSubject<any>;
    searchContainingPointers: BehaviorSubject<string | null[]>;
    startLoading(): void;
    stopLoading(): void;
}
