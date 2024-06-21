import Vue from 'vue'

const storage = require('electron-json-storage')
const { ipcRenderer } = require('electron')
const dataStorePath = ipcRenderer.sendSync('message-from-renderer', { operation: 'get', data: { target: 'dataPath' } })
storage.setDataPath(dataStorePath)

const $storage = {
  getData (dataName) {
    return storage.getSync(dataName)
  },
  getDataAsync (dataName, callBack) {
    storage.get(dataName, (error, data) => {
      let returnValue = {}
      if (error) {
        returnValue = {
          isError: true, data: {}
        }
      } else {
        returnValue = {
          isError: false, data
        }
      }
      callBack(returnValue)
    })
  },
  getAllData (callBack) {
    storage.getAll((error, data) => {
      let returnValue = {}
      if (error) {
        returnValue = {
          isError: true, data: {}
        }
      } else {
        returnValue = {
          isError: false, data
        }
      }
      callBack(returnValue)
    })
  },
  setData (dataName, dataTarget, callBackWhenError) {
    const result = storage.set(dataName, dataTarget, error => {
      if (error) {
        switch (callBackWhenError) {
        case undefined:
          return { isError: true, success: false }
        default:
          callBackWhenError(error)
          break
        }
      }
      return { isError: false, success: true }
    })
    return result
  },
  removeData (dataName, callBackWhenError) {
    const result = storage.remove(dataName, error => {
      if (error) {
        switch (callBackWhenError) {
        case undefined:
          return { isError: true, success: false }
        default:
          callBackWhenError(error)
          return { isError: true, success: false }
        }
      }
      return { isError: false, success: true }
    })
    return result
  },
  clearData (callBackWhenError) {
    const result = storage.clear(error => {
      if (error) {
        switch (callBackWhenError) {
        case undefined:
          return { isError: true, success: false }
        default:
          callBackWhenError(error)
          return { isError: true, success: false }
        }
      }
      return { isError: false, success: true }
    })
    return result
  },
  isExists (dataName, callBack) {
    storage.has(dataName, (error, hasKey) => {
      let returnValue = {}
      if (error) {
        returnValue = {
          isError: true, data: false
        }
      } else {
        returnValue = {
          isError: false, data: hasKey
        }
      }
      callBack(returnValue)
    })
  },
  debugAppPath () {
    return dataStorePath
  }
}

const loadStorageUtils = {
  install (Vue) {
    Vue.prototype.$storage = $storage
  }
}

Vue.use(loadStorageUtils)
