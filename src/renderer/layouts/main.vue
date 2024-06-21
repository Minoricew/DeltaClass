<template class="root-template">
  <v-app ref="defaultVApp" class="v-application-container">
    <div ref="defaultVAppInnerContent" class="v-application-inner-content">
      <span class="peripheral-border-top" />
      <span class="peripheral-line-left-top" />
      <img ref="bootLogo" class="boot-logo" src="~/assets/img/delta_white.svg">
      <div ref="defaultVAppExactContent" class="v-application-exact-content">
        <v-main ref="defaultVMain" class="default-v-main">
          <Nuxt />
        </v-main>
        <AppBar ref="appBar" class="main-app-bar" />
      </div>
      <VersionFix />
      <SnackBar />
      <ErrorHandler />
      <span class="peripheral-border-bottom" />
      <span class="peripheral-line-left-bottom" />
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'MainLayout',
  transition: 'slide-x-transition',
  mounted () {
    const isFirstLaunch = this.$storage.getData('launchStats').is1stLaunch
    if (isFirstLaunch === true) {
      this.initStyle()
      setTimeout(() => this.slidePageIn(), 100)
      this.$storage.setData('launchStats', { is1stLaunch: false })
    }
    const errorBroadcastChannel = new BroadcastChannel('DeltaClass.Plugins.ErrorHandler.Channel')
    errorBroadcastChannel.onmessage = this.determinePageShow
  },
  methods: {
    initStyle () {
      this.$refs.defaultVMain.$el.style.opacity = '0'
      this.$refs.defaultVMain.$el.style.transition = 'all 0.25s'
      this.$refs.defaultVApp.$el.style.marginLeft = '150vw'
      this.$refs.defaultVAppInnerContent.style.opacity = '0'
      this.$refs.bootLogo.style.display = 'block'
      this.$refs.appBar.$el.style.opacity = '0'
    },
    slidePageIn () {
      this.$refs.defaultVApp.$el.style.marginLeft = '0'
      setTimeout(() => {
        this.$refs.defaultVAppInnerContent.style.opacity = '1'
        setTimeout(() => {
          this.$refs.defaultVAppInnerContent.style.opacity = '0'
          setTimeout(() => {
            this.$refs.defaultVAppInnerContent.style.opacity = '1'
            setTimeout(() => this.showPageContent(), 1000)
          }, 75)
        }, 100)
      }, 1125)
    },
    showPageContent () {
      this.$refs.bootLogo.style.opacity = '0'
      setTimeout(() => {
        this.$refs.bootLogo.style.display = 'none'
        setTimeout(() => {
          this.$refs.defaultVMain.$el.style.opacity = '1'
          setTimeout(() => {
            this.$refs.appBar.$el.style.opacity = '1'
          }, 150)
        }, 100)
      }, 250)
    },
    determinePageShow (e) {
      if (e.data.isCritical) {
        this.$refs.defaultVMain.$el.style.transition = 'all 0.175s'
        this.$refs.defaultVMain.$el.style.opacity = '0'
        this.$refs.appBar.$el.style.transition = 'all 0.175s'
        this.$refs.appBar.$el.style.opacity = '0'
        setTimeout(() => {
          this.$refs.defaultVMain.$el.style.display = 'none'
          this.$refs.appBar.$el.style.display = 'none'
        }, 175)
      }
    }
  }
}
</script>

<style>

.v-application-container {
  --v-app-height: calc(100vh - 100vh * 0.075 * 0.2 * 2);
  --v-app-margin-top: calc((100vh - var(--v-app-height)) / 2);
  height: var(--v-app-height);
  width: 100vw;
  margin-top: var(--v-app-margin-top);
  transition: all 1.25s cubic-bezier(0,.85,.4,.99);
}

.v-application-inner-content {
  position: static;
  height: var(--v-app-height);
}

.default-v-main {
  height: calc(var(--v-app-height) - 56px);
}

.boot-logo {
  --logo-max-width: 17.5vw;
  max-width: var(--logo-max-width);
  margin-left: calc((100vw - var(--logo-max-width)) / 2);
  margin-top: calc((100vh - var(--logo-max-width)) / 2);
  opacity: 1;
  transition: all 0.25s;
  display: none;
}

.main-app-bar {
  transition: all 0.25s;
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

.peripheral-border-top {
  position: fixed;
  top: calc(-1 * var(--v-app-margin-top));
  left: calc(100vh * 0.075 * 0.2 * -1);
  height: calc(100vh * 0.075);
  width: calc(100vh * 0.075);
  border-left: solid 3px rgba(0, 0, 0, 0.5);
  border-top: solid 3px rgba(0, 0, 0, 0.5);
}

.peripheral-border-bottom {
  position: fixed;
  top: calc(100vh - var(--v-app-margin-top) - 100vh * 0.075);
  left: calc(100vh * 0.075 * 0.2 * -1);
  height: calc(100vh * 0.075);
  width: calc(100vh * 0.075);
  border-left: solid 3px rgba(0, 0, 0, 0.5);
  border-bottom: solid 3px rgba(0, 0, 0, 0.5);
}

.peripheral-line-left-top {
  position: fixed;
  top: calc(100vh * 0.085);
  left: calc(100vh * 0.075 * 0.2 * -1);
  height: calc(100vh * 0.025);
  width: min-content;
  border-left: solid 3px rgba(0, 0, 0, 0.5);
}

.peripheral-line-left-bottom {
  position: fixed;
  top: calc(100vh - 100vh * 0.085 - 100vh * 0.025 - var(--v-app-margin-top) * 2);
  left: calc(100vh * 0.075 * 0.2 * -1);
  height: calc(100vh * 0.025);
  width: min-content;
  border-left: solid 3px rgba(0, 0, 0, 0.5);
}

</style>
