<template>
  <div>
    <div class="logo-and-title">
      <a class="back-link" href="/HomePage">&lt; &lt; 返回主页</a>
      <SavingOverlay :isSaving="isSaving" :saveSuccess="saveSuccess"/>
      <div class="title-buttons">
        <button class="editor-button" @click="openShareCollaboration">共享协作</button>
        <button class="editor-button" @click="saveEditor">保存</button>
        <button class="exit-button" @click="showExitConfirm">退出</button>
      </div>
      <!--用户信息-->
      <div class="user-info">
        <img v-if="userAvatar" :src="userAvatar" alt="用户头像" class="user-avatar" @mouseover="showUser = true" @mouseleave="showUser=false">
        <div v-if="showUser" class="custom-popover">
            用户名: {{userName}}
            <el-divider></el-divider>
            星辉值: {{ stars }}
          </div>
        </div>
    </div>
    <hr class="divider">
    <ShareCollaboration ref="shareCollab"/>
  </div>
</template>
<script>
import ShareCollaboration from '@/components/SharedCollaboration.vue'; // 调整路径到实际位置
import SavingOverlay from '@/components/SavingOverlay.vue'; // 引入 SavingOverlay

export default {
  name: 'EditorTitle',
  components: {
    ShareCollaboration,
    SavingOverlay
  },
  props: {
    saveEditor: Function,
    showExitConfirm: Function,
    fileId: String,
    isSaving: Boolean,
    saveSuccess: Boolean,
    stars: Number,
    userAvatar: String,
    isVIP: Boolean,
    userName: String,
  },
  data() {
    return {
      showPopover: false,
      showUser:false,
    };
  },

  methods: {
    openShareCollaboration() {
      this.$refs.shareCollab.openDialog(this.fileId); // 打开共享协作弹窗
    },
    handleVIPClick() {
      // 处理 VIP 点击事件
      alert('充值功能待开发');
    }
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
  position: relative;
}

.title-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 25%;
}

.editor-button, .exit-button {
  font-size: 18px;
  font-weight: bold;
  font-family: "宋体";
  background-color: white;
  color: #305a8d;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
}

.editor-button:hover, .exit-button:hover {
  background-color: #305a8d;
  color: white;
}

.back-link {
  margin-left: 5px;
  color: #305a8d;
  text-decoration: none;
  font-size: 18px;
  width: 230px;
  font-weight: bold;
  font-family: "宋体";
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

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 80px;
}

.user-info {
  display: flex;
  align-items: center;
  position: relative;
  margin-left: auto;
}

.custom-popover {
  color: white;
  font-weight: bold;
  font-family: "宋体";
  position: absolute;
  top: 110%; /* 将 popover 放置在头像下方 */
  left: 10%; /* 将 popover 的左边对齐到头像的中间 */
  transform: translateX(-50%); /* 通过平移使 popover 水平居中 */
  width: 165px;
  background-image: linear-gradient(to top, #305a8d 0%, #a1b2e3 99%, #305a8d 100%);
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.custom-popover .el-divider {
  margin: 5px 0;
}

</style>
