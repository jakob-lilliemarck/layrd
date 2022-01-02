
/*
Rewrite this module to:
  - layer() should take an array of Functions OR Objects
      - Objects are assumed to be pre-configured "live" composables
      - Functions are assumed to be uninitalized composable Functions
  - Each layer() should be passed ONLY the returns of the preceeding layer, global config and layer-config as arguments

Example:


layrd()
  .layer(httpHandler)                             // http communication layer - returns callbacks for common http-methods and read-only-state
  .layer([actionHandler, authorizationHandler])   // Abstraction layers on top of common http methods
  .layer([cardTransformation])                    // State view-transformations - casts state and methods into a view-readable object
  .init()                                         // not sure init will be needed

This creates the following benefits:
  - Each layer effectivly acts as a single larger composable - but that can be split up depending on concern
  - It reduces the number of exports on the final object
  - Makes it possible so switch out layers and only, re-initialize the depending layers, while keeping "base state"
  - Makes the information flow clear and defines clear interfaces between layers
*/


module.exports = function layrd (config) {
  const state = {
    layers: [],
    layer: (fn, ...conf) => {
      state.layers.push({ fn, conf })
      return state
    },
    init: (callback) => {
      // Initialization
      const { newState, onInits } = state.layers.reduce(
        // Keep state and onInit-callbacks separate
        // onInits will not be passed to the final state
        ({ newState, onInits }, { fn, conf }) => {

          // Execute each composable, and separate onInit-callbacks from other returns
          const { onInit, ...obj } = fn(...conf, newState, config)
          Object.keys(obj).forEach((key) => {

            // Merge each key to the newState, and throw on key-naming conflicts
            if (!(key in newState)) {
              newState[key] = obj[key]
            } else {
              throw new Error(`Name conflict registering key "${key}" of "${fn.name}" to "${config.name}"`)
            }
          })
          return { newState, onInits: [...onInits, onInit || null] }
        }, { newState: state, onInits: [] })

        // Run on init-callbacks when each composable function has been merged
        onInits
          .filter((onInit) => !!onInit)
          .forEach((onInit) => { onInit() })

        // Run init-callback after everything is done - may be used to set a store-initialized state
        if (!!callback) callback(state)
        return newState
      }
    }
  return state
}
