export interface PropertyPreprocessOptions {
    childFor?: string;
    skipReadOnly?: boolean;
    discriminator?: string;
}
export declare class SchemaHelper {
    static setSpecManager(specMgr: any): void;
    static preprocess(schema: any, pointer: any, hostPointer?: any): any;
    static runInjectors(injectTo: any, schema: any, pointer: any, hostPointer?: any): void;
    static preprocessProperties(schema: any, pointer: string, opts: PropertyPreprocessOptions): void;
    static preprocessAdditionalProperties(schema: any, pointer: string): any;
    static unwrapArray(schema: any, pointer: any): any;
    static operationSummary(operation: any): any;
    static detectType(schema: any): any;
    static getTagsWithOperations(schema: any): {};
    static moveRequiredPropsFirst(properties: any[], _required: string[] | null): void;
}
