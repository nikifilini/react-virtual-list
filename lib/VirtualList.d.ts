import React from 'react';
declare type Options<T> = {
    container: Element | null;
    items: T[];
    itemHeight: number;
    itemBuffer: number;
};
declare type Virtual<T> = {
    virtual: {
        items: T[];
        style: {
            height: number;
            paddingTop: number;
            boxSizing: 'border-box';
            overflowY: 'hidden';
        };
    };
};
declare type ElementProps<T> = Options<T> & Virtual<T>;
declare type ListProps<T> = {
    children: (props: ElementProps<T>, scrollableRef: React.Ref<any>, ref: React.RefObject<any>) => JSX.Element;
    items: T[];
    itemHeight: number;
    itemBuffer: number;
};
declare function VirtualList<T>({ children: getComponent, items, itemHeight, itemBuffer }: ListProps<T>): JSX.Element;
export default VirtualList;
