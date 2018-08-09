import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SwaggerParameter } from './swagger-typings';
import { OptionsService } from '../services/options.service';
export interface DescendantInfo {
    $ref: string;
    name: string;
    active?: boolean;
    idx?: number;
}
export declare class SpecManager {
    _schema: any;
    rawSpec: any;
    apiUrl: string;
    apiProtocol: string;
    swagger: string;
    basePath: string;
    spec: BehaviorSubject<any>;
    specUrl: string;
    private parser;
    private options;
    constructor(optionsService: OptionsService);
    load(urlOrObject: string | Object): Promise<{}>;
    init(): void;
    preprocess(): void;
    schema: any;
    byPointer(pointer: any): any;
    resolveRefs(obj: any): any;
    getOperationParams(operationPtr: string): SwaggerParameter[];
    getTagsMap(): {};
    findDerivedDefinitions(defPointer: string, schema?: any): DescendantInfo[];
    getDescendant(descendant: DescendantInfo, componentSchema: any): any;
}
