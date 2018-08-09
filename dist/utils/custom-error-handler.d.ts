import { ErrorHandler } from '@angular/core';
import { AppStateService } from '../services/app-state.service';
export declare class CustomErrorHandler extends ErrorHandler {
    private appState;
    constructor(appState: AppStateService);
    handleError(error: any): void;
}
