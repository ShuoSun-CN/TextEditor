<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { verify_session } from '@/api/UserLogin'; // Assuming there is a function to verify session in your API

export default {
  name: 'App',
  async created() {
    await this.checkLoginStatus();
  },
  methods: {
    async checkLoginStatus() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await verify_session({session_id:session_id});
        // If no session_id, session is expired, or session verification fails, redirect to login page
        if ( response.code === -1) {
          this.$router.replace('/UserLogin');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        // Handle error if needed
      }
    }
  }
}
</script>
