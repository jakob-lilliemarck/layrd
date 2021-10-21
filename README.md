Layrd is a tiny framework for composing vue3 composables, or any other functions returning objects.

```js
// ./composables
const composableA = (configA) => {
  return { a: 'a' }
}

const composableB = (globalConfig, layrd) => {
  // globalConfig & the layrd-object are passed as the second to last and the last arguments.
  return {
    b: 'b',
    onInit: () => {
      // If provided, this callback runs after the layrd object has been initialized.
      // If an early layer need to sync state with later layers, initialize a watcher here.
    }
  }
}

// ./elsewhere
const { a, b } = layrd(globalConfig)
  .layer(composableA, configA)
  .layer(composableB)
  .init(() => {
    // This callback is run right before returning the entire layrd-object.
    // May be used to set a semaphore "initialized"
  })

```
