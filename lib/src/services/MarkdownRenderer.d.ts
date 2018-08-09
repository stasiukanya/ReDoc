import { AppStore } from './AppStore';
export declare const LEGACY_REGEXP = "^\\s*<!-- ReDoc-Inject:\\s+?{component}\\s+?-->\\s*$";
export declare const MDX_COMPONENT_REGEXP = "^\\s*<{component}\\s*?/>\\s*$";
export declare const COMPONENT_REGEXP: string;
export interface MDXComponentMeta {
    component: React.ComponentType;
    propsSelector: (store?: AppStore) => any;
    attrs?: object;
}
export interface MarkdownHeading {
    id: string;
    name: string;
    level: number;
    items?: MarkdownHeading[];
    description?: string;
}
export declare function buildComponentComment(name: string): string;
export declare class MarkdownRenderer {
    headings: MarkdownHeading[];
    currentTopHeading: MarkdownHeading;
    private headingEnhanceRenderer;
    private originalHeadingRule;
    constructor();
    saveHeading(name: string, level: number, container?: MarkdownHeading[], parentId?: string): MarkdownHeading;
    flattenHeadings(container?: MarkdownHeading[]): MarkdownHeading[];
    attachHeadingsDescriptions(rawText: string): void;
    headingRule: (text: string, level: number, raw: string) => string;
    renderMd(rawText: string, extractHeadings?: boolean): string;
    extractHeadings(rawText: string): MarkdownHeading[];
    renderMdWithComponents(rawText: string, components: Dict<MDXComponentMeta>): Array<string | MDXComponentMeta>;
}
