<template>
  <div class="settings-main-page">
    <div class="settings-main-page-title">
      <img src="~/assets/img/delta_white.svg">
      <span>设置</span>
    </div>
    <SettingsRootSettingsRenderer class="settings-main-page-items-renderer" />
  </div>
</template>

<script>

export default {
  name: 'SettingsPage',
  layout: 'main',
  transition: 'slide-x-transition',
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {

  }
}

</script>

<style>

html {
  overflow: hidden;
}

body {
  margin: 0 !important;
  transform-style: preserve-3d;
  transform-origin: 640px 660px;
  transform: perspective(1000px) rotateY(-8deg);
}

.settings-main-page {
  overflow-y: hidden;
}

.settings-main-page-title {
  text-align: center;
  min-height: 12.5vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-main-page-title img {
  max-width: 10vw;
  margin-right: 2.5%;
}

.settings-main-page-title span {
  font-size: xx-large;
  margin-left: 2.5%;
}

.settings-main-page-items-renderer {
  max-height: 80vh;
  overflow-y: scroll;
}

</style>
