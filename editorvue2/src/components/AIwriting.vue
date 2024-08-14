<template>
  <div class="file-list-page">
    <!-- Top Row -->
    <div class="top-row">
      <!-- Logo and Title -->
      <div class="logo-and-title">
        <img alt="logo" class="logo" src="../assets/logo.png">
        <span class="title2"><a>文曲星编辑器</a></span>
      </div>
      <!-- User Information -->
      <div class="user-info">
        <img v-if="userAvator" :src="userAvator" alt="用户头像" class="user-avator">
        <div v-if="isVIP" class="vip-container" @mouseleave="showPopover = false" @mouseover="showPopover = true">
          <div class="vip-info">
            <img alt="VIP 图标" class="vip-icon" src="../assets/icons/vip.svg">
            <span>会员</span>
          </div>
        </div>

        <el-dropdown>
          <span class="el-dropdown-link">
            用户名：{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeinfo">
              <img class="button-icon2" src="../assets/icons/xiugaixinxi.svg"> 修改信息
            </el-dropdown-item>
            <el-dropdown-item @click.native="spend">
              <img class="button-icon2" src="../assets/icons/spend.svg"> 星辉花费详情
            </el-dropdown-item>
            <el-dropdown-item @click.native="handleVIPClick">
              <img class="button-icon2" src="../assets/icons/vipmanage.svg"> 充值（续费vip）
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">
              <img class="button-icon2" src="../assets/icons/logout.svg"> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="content-section">
      <div class="content-section1">
      <h1>多模态信息智能提取</h1>
      <h2>1. 图片信息提取</h2>
      <p class="indent">
        文曲星编辑器的【图片信息提取】功能可以帮助您一键提取图片中的文字信息，在您的学习，工作中提供更便捷的服务。
      </p>
      <h2>2. 视频信息检测</h2>
      <p class="indent">
        文曲星编辑器的【视频信息检测】功能可以帮您识别视频主要信息，帮助您更好的理解视频内容，同时您可以使用该功能快速获悉视频内容，节约创作时间。
      </p>
      <h2>3. 语音信息提取</h2>
      <p class="indent">
        文曲星编辑器的【语音信息提取】功能可以帮助您实现语音转文字的功能，您可以使用该功能进行会议记录整理、课堂笔记整理等任务。
      </p>
      <h2>4. 目标检测</h2>
      <p class="indent">
        文曲星编辑器的【目标检测】功能可以帮助您快速识别图片主要内容，使用精简的词语描述图片，快速获取图片信息，提高创作效率。
      </p>
      <h1>AI润色</h1>
      <p class="indent">
        文曲星编辑器提供强大的【AI润色】功能，本功能涵盖智能修饰，摘要生成，智能续写，病句改写，实时翻译功能。文曲星编辑器的【AI润色】功能是您写作路上不可或缺的得力助手，它不仅能显著提升您的写作效率，更能助力您创作出更加出色、引人入胜的作品。
      </p>
      <p class="indent">需要注意的是，本功能非免费功能。在使用本功能时，编辑器会根据使用AI创作生成的字数自动扣除您的星辉值。</p>
      <h1>AI排版</h1>
      <p class="indent">
        文曲星编辑器提供【智能排版】功能。在本功能中，您可以选择自动分段、大创文书、公文写作和英文写作四种AI排版格式。不同的排版格式使用不同的字体。使用本功能，您可以创作出更规范，更美观的文章。
      </p>
      <p class="indent">需要注意的是，本功能同样需要消耗星辉来实现。</p>
    </div>
    </div>
  </div>
</template>

<script>
import {get_user_info} from '@/api/UserFile';
import {get_all_token_usage, get_consume_token_usage, get_obtain_token_usage} from '@/api/SpendInfo';

export default {
  name: 'FileListPage',
  data() {
    return {
      userName: '',
      userAvator: '',
      isVIP: false,
      stars: 0,
      showPopover: false,
      activeTab: 'all',
      allTokenDetails: [],
      spentTokenDetails: [],
      acquiredTokenDetails: [],
      currentToken: 0,
    };
  },

  async created() {
    await this.fetchUserInfo();
    this.fetchTokenDetails(); // Initial fetch based on default tab
  },

  methods: {
    async fetchTokenDetails() {
      let apiMethod;

      switch (this.activeTab) {
        case 'all':
          apiMethod = get_all_token_usage;
          break;
        case 'spent':
          apiMethod = get_consume_token_usage;
          break;
        case 'acquired':
          apiMethod = get_obtain_token_usage;
          break;
        default:
          return;
      }

      try {
        const session_id = localStorage.getItem('session_id');
        const response = await apiMethod({session_id});

        if (response.code === 0) {
          const data = JSON.parse(response.usage_info);
          if (this.activeTab === 'all') {
            this.allTokenDetails = data;
          } else if (this.activeTab === 'spent') {
            this.spentTokenDetails = data;
          } else if (this.activeTab === 'acquired') {
            this.acquiredTokenDetails = data;
          }
        } else {
          this.$message.error('获取 Token 使用详情失败');
        }
      } catch (error) {
        console.error('获取 Token 使用详情失败:', error);
        this.$message.error('获取 Token 使用详情失败');
      }
    },

    handleTabClick(tab) {
      this.activeTab = tab.name;
      this.fetchTokenDetails(); // Fetch details when tab is clicked
    },
    async changeinfo() {
      this.$router.push('/UserInfo');
    },
    async spend() {
      this.$router.push('/SpendInfo');
    },
    async logout() {
      localStorage.removeItem('session_id');
      this.userName = '';
      this.userAvator = '';
      this.isVIP = false;
      this.$router.push('/UserLogin');
    },

    handleVIPClick() {
      this.$message({
        message: '该功能尚在开发中，敬请期待。',
        type: 'warning',
      });
    },

    async fetchUserInfo() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await get_user_info({session_id});
        if (response.code === -1) {
          this.$message.error('登录过期，请重新登录');
          this.$router.push('/UserLogin');
        } else if (response.code === 1) {
          this.$message.error('系统故障');
        } else {
          this.userName = response.user_name;
          this.userAvator = "http://127.0.0.1:8000/avatar/" + response.user_avator;
          this.isVIP = response.vip === 1;
          this.stars = response.stars;
          this.currentToken = response.current_token; // Assuming response has current_token
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
  }
};
</script>

<style scoped>
@import '../assets/dingbu.css';
@import '../assets/HomePage.css';

.file-list-page {
  padding: 20px;
  overflow-y: auto; /* Enables vertical scrolling for the whole page */
}

.content-section {
  margin-top: 60px;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  background-color: #f5f5f5;
  margin-bottom: 20px;
}
.content-section1 {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.content-section h1 {
  font-weight: bold;
  color: blue;
  font-size: 22px;
  margin-bottom: 20px;
}

.content-section h2 {
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.content-section p {
  font-size: 18px;
  margin-bottom: 20px;
}

.logo-and-title {
  display: flex;
  align-items: center;
}

.logo {
  width: 50px;
  margin-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.user-avator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.vip-container {
  display: inline-block;
  position: relative;
}

.vip-info {
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  padding: 5px 5px;
  border-radius: 8px;
}

.vip-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.el-dropdown-link {
  cursor: pointer;
}

.divider {
  border-top: 1px solid #ccc;
  margin: 20px 0;
}
.indent {
    margin-left: 2em;
}

</style>
