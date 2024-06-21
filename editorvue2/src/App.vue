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
        if (!session_id) {
          // 如果本地没有 session_id，直接返回，不进行跳转
          this.$router.replace('/UserLogin');
        }

        const response = await verify_session({ session_id });
        if (response.code === -1) {
          // session_id 失效，清除本地数据并跳转到登录页面
          /*localStorage.removeItem('session_id');*/
          this.$router.replace('/UserLogin');
        } else if (response.code === 1) {
          // 其他错误情况处理，根据实际情况处理
          console.error('Verification failed with code 1');
        } else {
          this.$router.replace('/HomePage');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    }
  }
}
</script>
