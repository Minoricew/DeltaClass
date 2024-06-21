<template>
  <v-app class="v-application-popup">
    <v-main class="popup-v-main">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'PopupLayout'
}
</script>

<style>

body {
  margin: 0 !important;
}

.v-application-popup {
  background: transparent !important;
  color: rgba(255, 255, 255, 1);
}

</style>
