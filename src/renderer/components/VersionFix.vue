<template>
  <div class="main-version-fix">
    <v-icon color="white" size="18">mdi-creation-outline</v-icon>
    <p>{{ versionTag }}</p>
  </div>
</template>

<script>
export default {
  name: 'VersionFix',
  data () {
    return {
      versionTag: '0.0.0'
    }
  },
  mounted () {
    this.getVersionInfo()
  },
  methods: {
    getVersionInfo () {
      const { ipcRenderer } = require('electron')
      this.$data.versionTag = ipcRenderer.sendSync('message-from-renderer', {
        operation: 'get',
        data: {
          target: 'appVersion'
        }
      })
    }
  }
}
</script>

<style>

.main-version-fix {
  opacity: 0.7;
  position: fixed;
  right: 10px;
  top: 0;
  display: flex;
}

.main-version-fix .v-icon {
  margin-right: 10px;
}

.main-version-fix p {
  color: white;
  margin-top: 16px;
}

</style>
