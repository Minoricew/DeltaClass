import Vue from 'vue'

const errorBroadcastChannel = new BroadcastChannel('DeltaClass.Plugins.ErrorHandler.Channel')

window.onerror = (_event, _source, _line, _col, error) => {
  const isCritical = error.isCritical === true
  error.message = `[DCE Framework ${isCritical ? 'Critical ' : ''}${error.name}]` + error.message
  errorBroadcastChannel.postMessage({
    action: 'errorOcurred',
    isCritical,
    errorObject: error,
    type: 'framework'
  })
  throw error
}

window.addEventListener('error', e => {
  e.preventDefault()
})

const globalErrorHandler = (error, vm, _info) => {
  const isCritical = error.isCritical !== false
  error.message = `[DCE Runtime ${isCritical ? 'Critical ' : ''}${error.name}] ` + error.message
  if (vm.$root.$error === undefined) vm.$root.$error = {}
  vm.$root.$error.current = error
  errorBroadcastChannel.postMessage({
    action: 'errorOcurred',
    isCritical,
    errorObject: error,
    type: 'runtime'
  })
  throw error
}

Vue.config.errorHandler = globalErrorHandler
