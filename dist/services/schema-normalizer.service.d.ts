import { SpecManager } from '../utils/spec-manager';
export interface Reference {
    $ref: string;
    description: string;
}
export interface Schema {
    properties: any;
    allOf: any;
    items: any;
    additionalProperties: any;
}
export declare class SchemaNormalizer {
    _dereferencer: SchemaDereferencer;
    constructor(_schema: any);
    normalize(schema: any, ptr: any, opts?: any): any;
    reset(): void;
}
export declare class AllOfMerger {
    static merge(into: any, schemas: any): void;
    private static mergeObject(into, subSchema, allOfNumber);
    private static checkCanMerge(subSchema, into);
}
export declare class SchemaDereferencer {
    private _spec;
    private normalizator;
    private _refCouner;
    constructor(_spec: SpecManager, normalizator: SchemaNormalizer);
    reset(): void;
    visit($ref: any): void;
    exit($ref: any): void;
    dereference(schema: Reference, pointer: string): any;
}
