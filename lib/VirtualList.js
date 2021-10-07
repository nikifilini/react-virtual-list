import React from 'react';
import getVisibleItemBounds from './utils/getVisibleItemBounds';
import defaultMapToVirtualProps from './utils/defaultMapVirtualToProps';
import throttleWithRAF from './utils/throttleWithRAF';
const mapVirtualToProps = defaultMapToVirtualProps;
function VirtualList({ children: getComponent, items, itemHeight, itemBuffer }) {
    const [state, setState] = React.useState({
        firstItemIndex: 0,
        lastItemIndex: -1,
    });
    const containerRef = React.useRef(null);
    const options = {
        items,
        itemBuffer,
        itemHeight,
        container: containerRef.current,
    };
    const element = React.useRef(document.createElement('div'));
    const isMounted = React.useRef(false);
    React.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    // initialState allows us to set the first/lastItemIndex (useful for server-rendering)
    // if (options && options.initialState) {
    //   setState({
    //     ...state,
    //     ...options.initialState,
    //   })
    // }
    const setStateIfNeeded = (list, container, items, itemHeight, itemBuffer) => {
        const newState = getVisibleItemBounds(list, container, items, itemHeight, itemBuffer);
        if (newState === undefined) {
            return;
        }
        if (newState.firstItemIndex > newState.lastItemIndex) {
            return;
        }
        if (state.firstItemIndex !== newState.firstItemIndex || newState.lastItemIndex !== state.lastItemIndex) {
            setState(newState);
        }
    };
    let refreshState = () => {
        if (!isMounted.current)
            return;
        const { itemHeight, items, itemBuffer } = options;
        if (!options || !options.container)
            return;
        setStateIfNeeded(element.current, options.container, items, itemHeight, itemBuffer);
    };
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
        refreshState = throttleWithRAF(refreshState);
    }
    React.useEffect(() => {
        refreshState();
        if (!options || !options.container)
            return;
        options.container.addEventListener('scroll', refreshState);
        options.container.addEventListener('resize', refreshState);
        return () => {
            if (!options || !options.container)
                return;
            options.container.removeEventListener('scroll', refreshState);
            options.container.removeEventListener('resize', refreshState);
        };
    }, [options]);
    React.useEffect(() => {
        const { itemHeight, items, itemBuffer } = options;
        if (!options || !options.container)
            return;
        setStateIfNeeded(element.current, options.container, items, itemHeight, itemBuffer);
    });
    return getComponent(Object.assign(Object.assign({}, mapVirtualToProps(options, state)), options), containerRef, element);
}
export default VirtualList;
