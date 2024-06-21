<template>
  <v-app class="v-application-drawboard">
    <v-main class="drawboard-v-main">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DrawBoardLayout'
}
</script>

<style>

body {
  margin: 0 !important;
}

.v-application-drawboard {
  background: transparent !important;
  color: rgba(255, 255, 255, 1);
}

</style>
