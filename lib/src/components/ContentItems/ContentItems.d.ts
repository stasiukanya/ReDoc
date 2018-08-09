import * as React from 'react';
import { MDXComponentMeta } from '../../services/MarkdownRenderer';
import { ContentItemModel } from '../../services/MenuBuilder';
import { OperationModel } from '../../services/models';
import { SecurityDefs } from '../SecuritySchemes/SecuritySchemes';
export declare class ContentItems extends React.Component<{
    items: ContentItemModel[];
    allowedMdComponents?: Dict<MDXComponentMeta>;
}> {
    static defaultProps: {
        allowedMdComponents: {
            'security-definitions': {
                component: typeof SecurityDefs;
                propsSelector: (_store: any) => {
                    securitySchemes: any;
                };
            };
        };
    };
    render(): JSX.Element[] | null;
}
export interface ContentItemProps {
    item: ContentItemModel;
    allowedMdComponents?: Dict<MDXComponentMeta>;
}
export declare class ContentItem extends React.Component<ContentItemProps> {
    render(): JSX.Element[];
}
export declare class SectionItem extends React.Component<ContentItemProps> {
    render(): JSX.Element;
}
export declare class OperationItem extends React.Component<{
    item: OperationModel;
}> {
    render(): JSX.Element;
}
