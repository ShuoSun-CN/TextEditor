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
    }
=======
export default {
  name: 'App',
  components: {},
  created() {
    // Redirect to UserLogin route when the app is created
    this.$router.replace('/UserLogin');

>>>>>>> d5b8336089736c11db28896239be65605a9d4395
  }
</script>

<style>
</style>
