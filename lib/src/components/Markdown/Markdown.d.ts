import * as React from 'react';
import { AppStore, MDXComponentMeta } from '../../services';
export interface StylingMarkdownProps {
    dense?: boolean;
    inline?: boolean;
}
export interface BaseMarkdownProps extends StylingMarkdownProps {
    sanitize?: boolean;
    store?: AppStore;
}
export interface MarkdownProps extends BaseMarkdownProps {
    allowedComponents?: Dict<MDXComponentMeta>;
    source: string;
}
export declare class Markdown extends React.Component<MarkdownProps> {
    constructor(props: MarkdownProps);
    render(): JSX.Element;
}
export interface AdvancedMarkdownProps extends BaseMarkdownProps {
    parts: Array<string | MDXComponentMeta>;
}
export declare class AdvancedMarkdown extends React.Component<AdvancedMarkdownProps> {
    render(): JSX.Element | null;
}
