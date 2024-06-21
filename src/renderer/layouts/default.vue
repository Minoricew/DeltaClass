<template>
  <v-app>
    <v-main class="default-v-main">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'DefaultLayout',
  transition: 'slide-x-transition',
  mounted () {
    this.initLocalStorageValue()
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
    initLocalStorageValue () {
      // Begin init of isAlive status tag
      const isAlive = this.getLocalStorageItem('isAlive')
      switch (isAlive) {
      case null:
      case undefined:
      case 'false':
        this.setLocalStorageItem('isAlive', 'true')
      }
      // End init of isAlive status tag
    }
  }
}

</script>

<style>

body {
  margin: 0 !important;
  max-height: 100vh;
}

.theme--dark.v-application {
  background: rgba(0, 0, 0, 15%);
  color: rgba(255, 255, 255, 1);
}

.scroll-x-transition-active,
.scroll-x-transition-active {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}

.scroll-x-transition-enter,
.scroll-x-transition-to {
  opacity: 0;
  transform: translate3d(-15px, 0, 0);
}

</style>
