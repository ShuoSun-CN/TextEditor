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
    // 检查 sessionStorage 中的标志
    const redirected = sessionStorage.getItem('redirected');

    if (!redirected) {
      // 重定向到 UserLogin 路由
      this.$router.replace('/UserLogin');
      // 设置 sessionStorage 标志
      sessionStorage.setItem('redirected', 'true');
    }
  }
}
</script>

<style>
</style>
