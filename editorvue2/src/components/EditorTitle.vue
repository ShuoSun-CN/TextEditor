<template>
  <div class="page-title">
    <i class="el-icon-edit"></i>{{ title }}
  </div>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.page-title {
  text-align: left;
  margin: 20px 0;
}

.page-title h1 {
  font-size: 2em;
  font-weight: bold;
}
</style>
