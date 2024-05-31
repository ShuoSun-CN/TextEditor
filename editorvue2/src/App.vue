<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  created() {
    // Redirect to UserLogin route when the app is created
    this.$router.replace('/UserLogin');

  }
}
</script>

<style>
</style>
