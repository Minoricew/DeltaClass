<template>
  <div class="snackbar-root">
    <span class="snackbar-border-left-top" />
  </div>
</template>

<script>

export default {
  name: 'SnackBar'
}

</script>

<style>

.snackbar-root {
  display: none;
  position: fixed;
  bottom: 5vh;
  left: 5vw;
  min-height: 5vh;
  height: fit-content;
  width: 90vw;
  background-color: rgba(255, 255, 255, 0);
}

.snackbar-border-left-top {
  display: block;
  margin-top: -1vh;
  margin-left: -1vh;
  height: 1.25vh;
  width: 1.25vh;
  border-left: solid 3px rgba(0, 0, 0, 0.5);
  border-top: solid 3px rgba(0, 0, 0, 0.5);
}

</style>
