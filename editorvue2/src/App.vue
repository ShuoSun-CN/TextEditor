<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
<<<<<<< HEAD
export default {
  name: 'App',
  components: {},
  created() {
    // Redirect to UserLogin route when the app is created
    this.$router.replace('/UserLogin');
=======

  export default {
    name: 'App',
    components: {},
    created() {
      // Redirect to UserLogin route when the app is created
      this.$router.replace('/UserLogin');
    }
>>>>>>> a1b2960133127add8058edfca759688b9fae860e
  }
}
</script>

<style>
</style>
