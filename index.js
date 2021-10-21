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
