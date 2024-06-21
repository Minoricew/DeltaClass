<template>
  <v-app class="v-application-aio">
    <v-main class="aio-v-main">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'AIOLayout',
  mounted () {
    this.initLocalStorageICValue()
  },
  methods: {
    getLocalStorageItem (item) {
      const target = localStorage.getItem(item)
      if (typeof target === 'string') {
        try {
          return JSON.parse(target)
        } catch {
          switch (target) {
          case 'undefined':
            return undefined
          case 'null':
            return null
          case 'true':
            return true
          case 'false':
            return false
          default:
            return target
          }
        }
      } else if (typeof target === 'object') {
        return null
      } else {
        try {
          return Number(target)
        } catch {
          return target
        }
      }
    },
    setLocalStorageItem (target, item) {
      let value = null
      if (typeof item === 'object') {
        if ([undefined, null].includes(item)) {
          value = item
        } else {
          try {
            const stringifyItem = JSON.stringify(item)
            JSON.parse(stringifyItem)
            value = stringifyItem
          } catch {
            value = {}
          }
        }
      } else {
        value = item
      }
      localStorage.setItem(target, value)
    },
    initLocalStorageICValue () {
      let localStorageIC = this.getLocalStorageItem('ic')
      if (localStorageIC === null) { localStorageIC = {} }
      if (localStorageIC.activeWindow === undefined) { localStorageIC.activeWindow = {} }
      if (localStorageIC.aio === undefined) { localStorageIC.aio = {} }
      if (localStorageIC.drawBoard === undefined) { localStorageIC.drawBoard = {} }
      if (localStorageIC.tips === undefined) { localStorageIC.tips = {} }
      if (localStorageIC.aio.isHide === undefined) { localStorageIC.aio.isHide = false }
      if (localStorageIC.aio.isManualHide === undefined) { localStorageIC.aio.isManualHide = false }
      if (localStorageIC.aio.isWinConformHideReq === undefined) { localStorageIC.aio.isWinConformHideReq = false }
      if (localStorageIC.drawBoard.mode === undefined) { localStorageIC.drawBoard.mode = 'choose' }
      if (localStorageIC.drawBoard.color === undefined) { localStorageIC.drawBoard.color = '#DB4D6D' }
      if (localStorageIC.drawBoard.isColorPickerClosing === undefined) { localStorageIC.drawBoard.isColorPickerClosing = false }
      if (localStorageIC.drawBoard.isColorPickerShow === undefined) { localStorageIC.drawBoard.isColorPickerShow = false }
      if (localStorageIC.tips.floatBar === undefined) { localStorageIC.tips.floatBar = {} }
      if (localStorageIC.tips.floatBar.transparentTip === undefined) { localStorageIC.tips.floatBar.transparentTip = false }
      this.setLocalStorageItem('ic', localStorageIC)
    }
  }
}
</script>

<style>

body {
  margin: 0 !important;
}

.v-application-aio {
  background: transparent !important;
  color: rgba(255, 255, 255, 1);
}

</style>
