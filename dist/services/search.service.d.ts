import { AppStateService } from './app-state.service';
import { SchemaNormalizer } from './schema-normalizer.service';
import { SpecManager, StringMap, MarkdownHeading } from '../utils/';
import { SwaggerSpec, SwaggerOperation, SwaggerSchema, SwaggerResponse } from '../utils/swagger-typings';
export interface IndexElement {
    menuId: string;
    title: string;
    body: string;
    pointer: string;
}
export declare class SearchService {
    private app;
    private spec;
    normalizer: SchemaNormalizer;
    constructor(app: AppStateService, spec: SpecManager);
    ensureSearchVisible(containingPointers: string | null[]): void;
    indexAll(): void;
    search(q: any): StringMap<IndexElement[]>;
    index(element: IndexElement): void;
    indexDescriptionHeadings(headings: StringMap<MarkdownHeading>): void;
    indexTags(swagger: SwaggerSpec): void;
    indexPaths(swagger: SwaggerSpec): void;
    indexOperation(operation: SwaggerOperation, operationPointer: string): void;
    indexOperationParameters(operation: SwaggerOperation, operationPointer: string): void;
    indexOperationResponses(operation: SwaggerOperation, operationPtr: string): void;
    indexOperationResponseHeaders(response: SwaggerResponse, responsePtr: string, operationPtr: string): void;
    indexSchema(_schema: SwaggerSchema, name: string, absolutePointer: string, menuPointer: string, parent?: string): void;
}
