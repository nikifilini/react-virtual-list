export default defaultMapToVirtualProps;
declare function defaultMapToVirtualProps({ items, itemHeight }: {
    items: any;
    itemHeight: any;
}, { firstItemIndex, lastItemIndex }: {
    firstItemIndex: any;
    lastItemIndex: any;
}): {
    virtual: {
        items: any;
        style: {
            height: number;
            paddingTop: number;
            boxSizing: string;
            overflowY: string;
        };
    };
};
