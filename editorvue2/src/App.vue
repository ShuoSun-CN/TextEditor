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
        const session_expired_time = localStorage.getItem('session_expired_time');
        const currentTime = new Date().getTime();
        console.log('Session ID:', session_id);
        console.log('Session Expired Time:', session_expired_time);
        const response = await verify_session(session_id);
        // If no session_id, session is expired, or session verification fails, redirect to login page
        if (!session_expired_time || currentTime > session_expired_time || response.code === -1) {
          this.$router.replace('/UserLogin');
        } else {
          // Wait for 100 milliseconds to ensure the router is fully initialized before redirection
          setTimeout(() => {
            this.$router.replace('/MyEditor');
          }, 100);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        // Handle error if needed
      }
    }
  }
}
</script>
