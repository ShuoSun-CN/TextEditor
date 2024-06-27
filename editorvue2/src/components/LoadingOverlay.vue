<template>
  <div class="loading-overlay">
    <div class="loading">
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
    </div>
    <div class="loadingSentence">加载中...</div>
  </div>
</template>

<script>
export default {
  name: 'LoadingOverlay',
}
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(105, 145, 199, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading {
  display: flex;
  align-items: center;
  margin-bottom: 20px; /* 调整与“加载中...”之间的距离 */
}

.item {
  height: 50px;
  width: 5px;
  background: white;
  margin: 0px 3px;
  border-radius: 10px;
  animation: loading 1s infinite;
}

.loadingSentence {
  font-size: 18px;
  text-align: center;
  color: white;
}

@keyframes loading {
  0% {
    height: 0px;
  }

  50% {
    height: 50px;
  }

  100% {
    height: 0px;
  }
}

.item:nth-child(2) {
  animation-delay: 0.1s;
}

.item:nth-child(3) {
  animation-delay: 0.2s;
}

.item:nth-child(4) {
  animation-delay: 0.3s;
}

.item:nth-child(5) {
  animation-delay: 0.4s;
}

.item:nth-child(6) {
  animation-delay: 0.5s;
}

.item:nth-child(7) {
  animation-delay: 0.6s;
}

.item:nth-child(8) {
  animation-delay: 0.7s;
}
</style>
