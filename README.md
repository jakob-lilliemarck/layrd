Layrd is a tiny framework for composing vue3 "composables", but it has no
dependencies on vue.
Use Layrd when you want to compose a larger composable from many smaller ones.

```js
// ./composables
const foo = (fooConfig, previousLayer, globalConfig) => {
  return { foo: 'foo' }
}

const bar = (barConfig, previousLayer, globalConfig) => {
  return {
    bar: 'bar',
    onInit: () => {
      /* If provided, this callback runs after the layrd object has been initialized. If an early layer need to sync state with later layers, initialize a watcher here. */
    }
  }
}

// ./inSomeOtherFile
const globalConfig = { name: 'myLayrdComposable' }

const fooConfig = {/* config object passed only to foo */}

const barConfig = {/* config object passed only to bar */}

const { foo, bar } = layrd(globalConfig)
  .layer(fooConfig)
  .layer(barConfig)
  .init(() => {
    /* This callback is run right before returning the entire layrd-object.
    May be used to set a semaphore "initialized" */
  })
```
