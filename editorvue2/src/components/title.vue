<template>
  <div>
    <div class="logo-and-title">
      <a class="back-link" href="/HomePage">&lt; &lt; 返回主页</a>
      <div class="title-buttons">
        <button class="editor-button" @click="saveEditor">保存</button>
        <button class="exit-button" @click="showExitConfirm">退出</button>
      </div>
    </div>
    <hr class="divider">
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
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
}

.title-buttons {
  display: flex;
  align-items: center;
}

.editor-button {
  background-color: #6991c7;
  color: white;
  border: none;
  border-radius: 10%;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
}

.exit-button {
  background-color: #6991c7;
  color: white;
  border: none;
  border-radius: 10%;
  padding: 10px 20px;
  margin-right: 20px;
  cursor: pointer;

}

.editor-button:hover, .exit-button:hover {
  background-color: #a1b2e3;
}

.back-link {
  margin-left: 5px;
  color: #6991c7;
  text-decoration: none;
  font-size: 18px;
}

.back-link:hover {
  text-decoration: underline;
}

.divider {
  width: 100%;
  border: none;
  border-top: 2px solid #e1e0e0;
  margin: 0;
}
</style>
