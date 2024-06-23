<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { verify_session } from '@/api/UserLogin';

export default {
  name: 'App',
  async created() {
    await this.checkLoginStatus();
  },
  methods: {
    async checkLoginStatus() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await verify_session({session_id: session_id});
        if (response.code === -1) {
          this.$router.replace('/UserLogin');
        } else {
          if (this.$route.path === '/UserLogin' || this.$route.path === '/') {
            this.$router.replace('/HomePage');
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        // Handle error if needed
      }
    }
  }
}
</script>
<style lang="scss">
body {
  font-family:”Microsoft YaHei”,Arial,Helvetica,sans-serif,”宋体”;
}
</style>

