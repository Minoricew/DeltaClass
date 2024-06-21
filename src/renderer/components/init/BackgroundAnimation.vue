<template>
  <col ref="initBackground" class="init-background">
</template>

<script>
export default {
  name: 'InitBackgroundAnimation',
  data () {
    return {

    }
  },
  mounted () {
    setTimeout(() => {
      this.showAnimation()
    }, 200)
  },
  methods: {
    showAnimation () {
      this.$refs.initBackground.style.top = '-50vh'
      this.$refs.initBackground.style.left = '-50vw'
    }
  }
}
</script>

<style>

.init-background {
  position: fixed;
  display: block;
  height: 200vh;
  width: 200vw;
  opacity: 0.95;
  top: -350vh;
  left: -350vw;
  transform: rotate(-45deg);
  transition: all 0.6s;
  transition-timing-function: cubic-bezier(0.000, 0.395, 0.125, 1.000);
  background-color: rgba(0, 0, 0);
  z-index: -1;
}

</style>
