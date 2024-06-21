<template>
  <v-app>
    <!--Nothing-->
  </v-app>
</template>

<script>
export default {
  name: 'DrivePage',
  layout: 'main',
  transition: 'slide-x-transition'
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

</style>
