<template>
  <div class="logo-and-title">
    <div class="title-buttons">
      <button @click="saveEditor" class="editor-button">保存</button>
      <button @click="showExitConfirm" class="exit-button">退出</button>
    </div>
    <img src="../assets/logo.png" alt="logo" class="logo">
    <span class="title2">文曲星编辑器</span>

  </div>
</template>

<script>
export default {
  name: 'EditorTitle',
  props: {
    saveEditor: Function,
    showExitConfirm: Function
  }
};
</script>

<style scoped>
.logo-and-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 300px;
  margin-bottom: 5px;
  margin-top: 10px;
}

.title2 {
  font-weight: bold;
  color: #707070;
  font-size: 35px;
  background-image: linear-gradient(to top, #a3bded 0%, #6991c7 100%);
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 5px;
}

.title-buttons {
  margin-left: 120px;
  display: flex;
  align-items: center;
}

.editor-button {
  background-color: #305a8d;
  color: white;
  border: none;
  border-radius: 10%;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
}

.editor-button:hover {
  background-color: #a1b2e3;
}

.exit-button {
  background-color: #86a6d8;
  color: white;
  border: none;
  border-radius: 10%;
  padding: 10px 20px;
  margin-left:5px;
  cursor: pointer;
}

.exit-button:hover {
  background-color: #a1b2e3;
}
</style>
