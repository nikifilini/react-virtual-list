# Example

```js
const TestComponent = () => {
  const items = [1, 2, 3, 4, 5]

  return (
    <React.Fragment>
      <VirtualList items={items} itemHeight={0} itemBuffer={0}>
        {({ virtual, itemHeight }, scrollableRef, ref) => (
          <div style={{ overflowY: 'auto' }} ref={scrollableRef}>
            <div ref={ref} style={virtual.style}>
              {virtual.items.map((item) => (
                <div style={{ height: itemHeight }}>{item}</div>
              ))}
            </div>
          </div>
        )}
      </VirtualList>
    </React.Fragment>
  )
}
```
