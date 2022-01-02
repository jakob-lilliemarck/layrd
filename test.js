const layrd = require('./index')

test('Registers composable contents and initializes', () => {
  let barInitialized;
  let allInitialized;

  const fooComposable = (fooConfig, previousLayer, globalConfig) =>
    ({ foo: fooConfig.layername })


  const barComposable = (barConfig, previousLayer, globalConfig) => {
    return {
      bar: barConfig.layername,
      onInit: () => {
        barInitialized = true
      }
    }
  }

  const globalConfig = { name: 'myLayrdComposable '}
  
  const { foo, bar } = layrd(globalConfig)
  .layer(fooComposable, { layername: 'foo' })
  .layer(barComposable, { layername: 'bar' })
  .init(() => {
    allInitialized = true
  })

  expect(foo).toBe('foo')
  expect(bar).toBe('bar')
  expect(barInitialized).toBe(true)
  expect(allInitialized).toBe(true)
})

test('Throws when composables exports has name-clashes', () => {
  const fooComposable = (fooConfig, previousLayer, globalConfig) =>
    ({ foo: fooConfig.layername })

  const barComposable = (barConfig, previousLayer, globalConfig) =>
    ({ foo: barConfig.layername })

  expect(() => {
    layrd()
    .layer(fooComposable, { layername: 'foo' })
    .layer(barComposable, { layername: 'bar' })
    .init()
  }).toThrowError()

})
