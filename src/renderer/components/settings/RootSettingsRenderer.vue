<template>
  <div>
    <v-btn
      v-for="settingsType in settingsTypeArray"
      v-if="settingsType.isShow"
      :key="settingsType.key"
      :disabled="settingsType.isDisabled"
      class="settings-single-item-entrance white--text"
      color="transparent"
      block
      elevation="0"
      @click="pushSettingsSubpageRouter(settingsType.id)"
    >
      <v-icon>{{ settingsType.icon }}</v-icon>
      <div>
        <p class="settings-single-item-title">{{ settingsType.name }}</p>
        <p class="settings-single-item-description">{{ settingsType.description }}</p>
      </div>
    </v-btn>
  </div>
</template>

<script>

export default {
  name: 'RootSettingsRenderer',
  data () {
    return {
      settingsTypeArray: []
    }
  },
  mounted () {
    this.$data.settingsTypeArray = this.$settings.getRootSettingsType()
  },
  methods: {

  }
}

</script>

<style>

.settings-single-item-entrance {
  display: flex;
  height: fit-content !important;
  text-align: left;
  padding: 2.5% 3% !important;
}

.settings-single-item-entrance p {
  margin-bottom: 1.5%;
}

.settings-single-item-entrance .v-btn__content {
  justify-content: flex-start;
}

.settings-single-item-entrance .v-icon {
  font-size: 250%;
  margin-right: 3%;
}

.settings-single-item-title {
  font-size: x-large;
}

.settings-single-item-description {
  font-size: small;
  opacity: 0.4;
}

</style>
