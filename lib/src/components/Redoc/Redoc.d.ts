import * as PropTypes from 'prop-types';
import * as React from 'react';
import { AppStore } from '../../services';
export interface RedocProps {
    store: AppStore;
}
export declare class Redoc extends React.Component<RedocProps> {
    static propTypes: {
        store: PropTypes.Validator<any>;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
