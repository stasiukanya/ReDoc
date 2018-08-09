export declare class IntHistoryService {
    private _emiter;
    constructor();
    readonly hash: string;
    subscribe(cb: any): () => void;
    emit: () => void;
    bind(): void;
    dispose(): void;
    update(hash: string | null, rewriteHistory?: boolean): void;
}
export declare const HistoryService: IntHistoryService;
