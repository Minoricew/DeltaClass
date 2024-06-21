<template>
  <div class="error-handler-root">
    <div class="error-handler-content">
      <span ref="redTriangle" class="error-red-triangle" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'ErrorHandler',
  data () {
    return {
      errorMessage: ''
    }
  },
  mounted () {
    const errorBroadcastChannel = new BroadcastChannel('DeltaClass.Plugins.ErrorHandler.Channel')
    errorBroadcastChannel.onmessage = this.handleErrorEvent
  },
  methods: {
    handleErrorEvent (e) {
      if (e.data.isCritical) {
        this.$data.errorMessage = e.data.message
        this.showErrorOverlay()
      }
    },
    showErrorOverlay () {

    }
  }
}

</script>

<style>

.error-handler-root {
  position: fixed;
}

.error-handler-content {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.error-red-triangle {
  --red-triangle-border-horizontal-width: 10vw;
  border-width: calc(var(--red-triangle-border-horizontal-width) * 1.732) var(--red-triangle-border-horizontal-width);
  border-style: solid;
  border-color: transparent transparent rgba(255, 30, 30, 0.7) transparent;
}

</style>
