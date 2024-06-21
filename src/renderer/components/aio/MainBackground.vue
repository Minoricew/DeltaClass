<template>
  <div class="aiobg-root">
    <span class="aiobg-line-left" />
    <div class="aiobg-triangle-left" />
    <div class="aiobg-center-block" />
    <div class="aiobg-triangle-right" />
    <span class="aiobg-line-right" />
  </div>
</template>

<script>
export default {
  name: 'AIOMainBackground',
  data: () => ({

  }),
  mounted () {

  }
}
</script>

<style>

.aiobg-root {
  display: flex;
  opacity: 80%;
  max-height: 100vh;
  overflow: hidden;
}

.aiobg-line-left {
  display: inline;
  position: fixed;
  left: calc(100vw * 0.125 * 0.5 * 0.25);
  height: calc(100vh);
  width: calc(100vh * 0.6);
}

.aiobg-line-left::before {
  content: '';
  position: absolute;
  top: -5%;
  left: 80%;
  width: 2.5px;
  height: 150%;
  background-color: rgba(255, 255, 255, 0.9);
  transform-origin: 0 0;
  transform: rotate(calc(atan(0.6)));
}

.aiobg-triangle-left {
  width: 0;
  height: 0;
  border-bottom: calc(100vh) solid rgba(255, 255, 255);
  border-left: calc(100vh * 0.6) solid transparent;
  margin-left: calc(100vw * 0.125 * 0.5 - 100vh * 0.6);
}

.aiobg-center-block {
  background-color: rgba(255, 255, 255);
  width: calc(100vw * 0.875);
}

.aiobg-triangle-right {
  width: 0;
  height: 0;
  border-bottom: calc(100vh) solid rgba(255, 255, 255);
  border-right: calc(100vh * 0.6) solid transparent; /* sin(37°) */
  margin-right: calc(100vw * 0.125 * 0.5 - 100vh * 0.6);
}

.aiobg-line-right {
  display: inline;
  position: fixed;
  right: calc(100vw * 0.125 * 0.5 * 0.25);
  height: calc(100vh);
  width: calc(100vh * 0.6);
}

.aiobg-line-right::before {
  content: '';
  position: absolute;
  top: -5%;
  right: 80%;
  width: 2.5px;
  height: 150%;
  background-color: rgba(255, 255, 255, 0.9);
  transform-origin: 0 0;
  transform: rotate(calc(-1 * atan(0.6)));
}

</style>
