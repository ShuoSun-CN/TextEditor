<template>
  <div class="file-list-page">
    <!-- 顶部行 -->
    <div class="top-row">
      <!-- Logo 和 标题 -->
      <div class="logo-and-title">
        <img alt="logo" class="logo" src="../assets/logo.png">
        <span class="title2"><a>文曲星编辑器</a></span>
      </div>
      <!-- 用户信息 -->
      <div class="user-info">
        <img v-if="userAvator" :src="userAvator" alt="用户头像" class="user-avator">
        <div v-if="isVIP" class="vip-container" @mouseleave="showPopover = false" @mouseover="showPopover = true">
          <div class="vip-info">
            <img alt="VIP 图标" class="vip-icon" src="../assets/icons/vip.svg">
            <span>会员</span>
          </div>
          <div v-if="showPopover" class="custom-popover">
            <p>剩余星辉数目: {{ stars }}</p>
            <button class="test123" @click="handleVIPClick">充值</button>
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
    <!-- 水平分隔线 -->
    <hr class="divider">
<div class="test111">
  <a class="back-link" href="/HomePage">&lt; &lt; 返回主页</a>
</div>
    <div class="token-page">
      <!-- Token Balance Display -->
      <div class="token-balance">
        <span>当前剩余Token: </span>
        <span class="token-value">{{ stars }}</span>
      </div>

      <!-- Tabs for Token Details -->
      <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="center-tabs">
        <el-tab-pane label="全部明细" name="all"></el-tab-pane>
        <el-tab-pane label="消耗明细" name="spent"></el-tab-pane>
        <el-tab-pane label="获取明细" name="acquired"></el-tab-pane>
      </el-tabs>


      <div class="table-container1">
        <el-table v-if="activeTab === 'all'" :data="allTokenDetails" stripe>
          <el-table-column prop="consume_type" label="星辉事项" width="180"></el-table-column>
          <el-table-column prop="consume_tokens" label="数量" width="200"></el-table-column>
          <el-table-column prop="rest_tokens" label="剩余数量" width="200"></el-table-column>
          <el-table-column prop="consume_time" label="花费时间" width="250"></el-table-column>
        </el-table>

        <el-table v-if="activeTab === 'spent'" :data="spentTokenDetails" stripe>
          <el-table-column prop="consume_type" label="星辉事项" width="180"></el-table-column>
          <el-table-column prop="consume_tokens" label="数量" width="200"></el-table-column>
          <el-table-column prop="rest_tokens" label="剩余数量" width="200"></el-table-column>
          <el-table-column prop="consume_time" label="花费时间" width="250"></el-table-column>
        </el-table>

        <el-table v-if="activeTab === 'acquired'" :data="acquiredTokenDetails" stripe>
          <el-table-column prop="consume_type" label="星辉事项" width="180"></el-table-column>
          <el-table-column prop="consume_tokens" label="数量" width="200"></el-table-column>
          <el-table-column prop="rest_tokens" label="剩余数量" width="200"></el-table-column>
          <el-table-column prop="consume_time" label="花费时间" width="250"></el-table-column>
        </el-table>
      </div>


      <!-- Buttons -->
      <div class="token-actions">
        <el-button type="primary" class="buybutton" @click="buyToken">购买星辉</el-button>
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
    buyToken() {
      this.$message.info('购买功能尚在开发中，敬请期待。');
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
.table-container1 {
  width:100%;
  display: flex;
  justify-content: center;
  margin-top: 20px; /* Add some margin if needed */
}
.center-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px; /* Add some margin if needed */
}

.user-info-content span {
  margin-right: 50px;
}

.search-bar .el-input {
  flex: 1;
}

.search-bar .el-button {
  margin-left: 10px;
}

/* Additional styles for table */
.table-header span, .table-row span {
  flex: 1;
  text-align: center;
}
.el-table {
  max-width: 1000px; /* Adjust this value as needed */
}
.table-row img.user-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
}
.test111{
  margin-left: 20px;
  margin-top: 80px;
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

.vip-container {
  display: inline-block;
  position: relative;
}

.test123 {
  background-color: #6991c7;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 10px;
}

.test123:hover {
  background-color: #6991c7;
}

.token-page {
  padding: 20px;
  margin-bottom: 100px;
}

.token-balance {
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-bottom: 20px;
  margin-left: 235px;
}

.token-value {
  font-size: 48px;
  font-weight: bold;
  margin-left: 10px;
}

.token-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.el-button {
  margin-left: 10px;
}
.buybutton {
  background-color: #accbee !important;
  color: black !important;
}
.custom-popover {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  padding: 10px;
  background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}
</style>
