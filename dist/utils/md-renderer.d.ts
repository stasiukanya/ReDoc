import { StringMap } from './';
export interface MarkdownHeading {
    title?: string;
    id: string;
    slug?: string;
    content?: string;
    children?: StringMap<MarkdownHeading>;
}
export declare class MdRenderer {
    private raw;
    headings: StringMap<MarkdownHeading>;
    currentTopHeading: MarkdownHeading;
    private _origRules;
    private _preProcessors;
    constructor(raw?: boolean);
    addPreprocessor(p: Function): void;
    saveOrigRules(): void;
    restoreOrigRules(): void;
    saveHeading(title: string, parent?: MarkdownHeading): MarkdownHeading;
    flattenHeadings(container: StringMap<MarkdownHeading>): MarkdownHeading[];
    attachHeadingsContent(rawText: string): void;
    headingOpenRule(tokens: any, idx: any): any;
    headingCloseRule(tokens: any, idx: any): any;
    renderMd(rawText: string): any;
}
