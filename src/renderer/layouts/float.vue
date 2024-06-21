<template>
  <v-app class="v-application-float">
    <v-main class="float-v-main">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'FloatLayout'
}
</script>

<style>

body {
  margin: 0 !important;
}

.v-application-float {
  background: transparent !important;
  color: rgba(255, 255, 255, 1);
}

</style>
