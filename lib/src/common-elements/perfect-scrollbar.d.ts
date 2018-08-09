import * as React from 'react';
import PerfectScrollbarType from 'perfect-scrollbar';
export declare class PerfectScrollbar extends React.Component<{
    options?: PerfectScrollbarType.Options;
    className?: string;
    updateFn: (fn: any) => void;
}> {
    private _container;
    private inst;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    handleRef: (ref: any) => void;
    render(): JSX.Element;
}
