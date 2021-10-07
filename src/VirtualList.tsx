import React from 'react'

import getVisibleItemBounds from './utils/getVisibleItemBounds'
import defaultMapToVirtualProps from './utils/defaultMapVirtualToProps'
import throttleWithRAF from './utils/throttleWithRAF'

const mapVirtualToProps = defaultMapToVirtualProps

type Options<T> = {
  container: Element | null
  items: T[]
  itemHeight: number
  itemBuffer: number
}

interface State {
  firstItemIndex: number
  lastItemIndex: number
}
type Virtual<T> = {
  virtual: {
    items: T[]
    style: {
      height: number
      paddingTop: number
      boxSizing: 'border-box'
      overflowY: 'hidden'
    }
  }
}
type ElementProps<T> = Options<T> & Virtual<T>

type ListProps<T> = {
  children: (props: ElementProps<T>, scrollableRef: React.RefObject<any>, ref: React.RefObject<any>) => JSX.Element
  items: T[]
  itemHeight: number
  itemBuffer: number
}

function VirtualList<T>({ children: getComponent, items, itemHeight, itemBuffer }: ListProps<T>) {
  const [state, setState] = React.useState<State>({
    firstItemIndex: 0,
    lastItemIndex: -1,
  })

  const containerRef = React.useRef(null)

  const options: Options<T> = {
    items,
    itemBuffer,
    itemHeight,
    container: containerRef.current,
  }

  const element = React.useRef(document.createElement('div'))

  const isMounted = React.useRef(false)
  React.useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // initialState allows us to set the first/lastItemIndex (useful for server-rendering)
  // if (options && options.initialState) {
  //   setState({
  //     ...state,
  //     ...options.initialState,
  //   })
  // }

  const setStateIfNeeded = (list: Element | Text | null, container: Element, items: any[], itemHeight: number, itemBuffer: number) => {
    const newState = getVisibleItemBounds(list, container, items, itemHeight, itemBuffer)

    if (newState === undefined) {
      return
    }

    if (newState.firstItemIndex > newState.lastItemIndex) {
      return
    }
    if (state.firstItemIndex !== newState.firstItemIndex || newState.lastItemIndex !== state.lastItemIndex) {
      setState(newState)
    }
  }

  let refreshState = () => {
    if (!isMounted.current) return

    const { itemHeight, items, itemBuffer } = options
    if (!options || !options.container) return
    setStateIfNeeded(element.current, options.container, items, itemHeight, itemBuffer)
  }
  if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
    refreshState = throttleWithRAF(refreshState)
  }

  React.useEffect(() => {
    refreshState()

    if (!options || !options.container) return

    options.container.addEventListener('scroll', refreshState)
    options.container.addEventListener('resize', refreshState)

    return () => {
      if (!options || !options.container) return
      options.container.removeEventListener('scroll', refreshState)
      options.container.removeEventListener('resize', refreshState)
    }
  }, [options])

  React.useEffect(() => {
    const { itemHeight, items, itemBuffer } = options
    if (!options || !options.container) return
    setStateIfNeeded(element.current, options.container, items, itemHeight, itemBuffer)
  })

  return getComponent({ ...(mapVirtualToProps(options, state) as Virtual<T>), ...options }, containerRef, element)
}

export default VirtualList
