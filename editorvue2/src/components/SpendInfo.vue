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

  <div class="token-page">
    <!-- Token Balance Display -->
    <div class="token-balance">
      <span>当前剩余Token: </span>
      <span class="token-value">{{ currentToken }}</span>
    </div>

    <!-- Tabs for Token Details -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="全部明细" name="all"></el-tab-pane>
      <el-tab-pane label="获取明细" name="acquired"></el-tab-pane>
      <el-tab-pane label="消耗明细" name="spent"></el-tab-pane>
      <el-tab-pane label="已过期" name="expired"></el-tab-pane>
    </el-tabs>

    <!-- Token Details Table -->
    <el-table :data="filteredTokenDetails" stripe>
      <el-table-column prop="id" label="编号" width="180"></el-table-column>
      <el-table-column prop="time" label="获取时间" width="200"></el-table-column>
      <el-table-column prop="reason" label="获取事项" width="200"></el-table-column>
      <el-table-column prop="amount" label="获取数量" width="150"></el-table-column>
      <el-table-column prop="expiry" label="有效期限" width="200"></el-table-column>
    </el-table>

    <!-- Buttons -->
    <div class="token-actions">
      <el-button type="primary" @click="buyToken">购买Token</el-button>
      <el-button type="primary" @click="exchangeToken">兑换Token</el-button>
    </div>
  </div>
  </div>
</template>
<script>
import {MessageBox} from "element-ui";
import {get_user_info} from '@/api/UserFile'; // 假设这是从后端获取用户信息的 API
import {create_text, get_recent_text_list} from '@/api/FileManage'; // 假设这是从后端获取文件列表的 API
import {get_shared_list, remove_shared_priority} from "@/api/ShareFile";/*
import {get_all_token_usage,get_consume_token_usage,get_obtain_token_usage} from '@/api/SpendInfo';*/

export default {
  name: 'FileListPage',
  components: {
  },
  data() {
    return {
      searchQuery: '', // 搜索框输入
      userName: '', // 用户名
      userAvator: '', // 用户头像URL
      isVIP: false, // 用户是否是VIP
      stars: 0, // 添加用于存储 stars 数量的属性
      dialogVisible1: false,
      tableData: [], // 存储从后端获取的文件列表信息
      selectedFiles: [], // 存储选中的文件
      loading: true, // 加载状态
      recentDaysFiles: [], // 存储最近三个不同日期的文件列表
      dialogVisible: false, // 分享协作弹窗可见性
      searchUserId: "", // 搜索用户ID
      searchResult: null, // 搜索结果
      currentFile: null, // 当前操作的文件
      sharedList: [], // 协作者列表
      userInfoDialogVisible: false,
      showUserInfo: false, // 控制用户信息显示
      userInfo: null, // 用户信息
      showPopover: false,
      currentToken: 1000000, // Display current token balance
      activeTab: 'acquired', // Default active tab
      tokenDetails: [
        {
          id: '8957387',
          time: '2024-05-24 14:58',
          reason: '新用户体验Token',
          amount: 1000000,
          expiry: '2024-08-25',
        },
        // Add more token details as needed
      ],
    };
  },
  async created() {
    await this.fetchUserInfo(); // 获取用户信息
    await this.fetchTextList(); // 获取文件列表信息
    this.recentDaysFiles.forEach(dayFiles => {
      dayFiles.files.forEach(file => {
        this.$set(file, 'hovered', false); // 初始化hovered属性
      });
    });
    this.recentDaysFiles.forEach(dayFiles => {
      dayFiles.files.forEach(file => {
        this.$set(file, 'showMenu', false); // 初始化为 false，确保初始状态下隐藏
      });
    });
  },
   computed: {
    filteredTokenDetails() {
      // Filter token details based on active tab
      switch (this.activeTab) {
        case 'acquired':
          return this.tokenDetails.filter(token => token.reason.includes('获取'));
        case 'spent':
          return this.tokenDetails.filter(token => token.reason.includes('消耗'));
        case 'expired':
          return this.tokenDetails.filter(token => new Date(token.expiry) < new Date());
        default:
          return this.tokenDetails;
      }
    },
  },
  methods: {
     handleTabClick(tab) {
      this.activeTab = tab.name;
    },
    buyToken() {
      // Logic for buying tokens
      this.$message.info('购买Token功能尚在开发中，敬请期待。');
    },
    exchangeToken() {
      // Logic for exchanging tokens
      this.$message.info('兑换Token功能尚在开发中，敬请期待。');
    },
    async removeSharedPriority(user) {
      try {
        // 显示确认对话框
        const result = await MessageBox.confirm('您确定要移除该协作者吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        if (result === 'confirm') {
          // 用户点击了“确定”按钮
          const session_id = localStorage.getItem('session_id');
          const file_id = this.currentFile.file_id; // 获取当前操作的文件ID
          const user_id = user.user_id; // 获取要移除的用户ID

          const response = await remove_shared_priority(session_id, file_id, user_id);

          if (response.code === 0) {
            this.$message.success('移除协作者成功');
            await this.fetchSharedList(file_id); // 重新获取协作者列表
          } else {
            this.$message.error('移除协作者失败');
          }
        } else {
          // 用户点击了“取消”按钮
          this.$message.info('取消移除操作');
        }
      } catch (error) {
        console.error('移除协作者失败:', error);
        this.$message.error('移除协作者失败');
      }
    },
    formatDateToChinese(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
      return `${year}年${month}月${day}日 ${weekday}`;
    },

    async MyEditor() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await create_text({session_id: session_id});
        if (response.code === 0) {
          this.$router.push({path: '/MyEditor', query: {file_id: response.file_id,}});
        }
      } catch (error) {
        console.error('创建文件失败:', error);
      }
    },
    async AIWriting() {
      this.$router.push('/AIwriting');
    },
    async AllFile() {
      this.$router.push('/AllFile');
    },
    async SharedToMe() {
      this.$router.push('/SharedToMe');
    },
    async fetchUserInfo() {
      try {
        // 假设从本地存储中获取 session_id
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
          this.isVIP = response.vip === 1; // 检查用户是否是VIP
          this.stars = response.stars;
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    async fetchSharedList(file_id) {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await get_shared_list(session_id, file_id);

        if (response.code === 0) {
          this.sharedList = JSON.parse(response.priority_list).map(user => ({
            ...user,
            priority: user.priority === 0 ? '只读' : '可编辑' // 显示权限
          }));
        } else if (response.code === 2) {
          this.$message.error('无权分享该文件');
        } else if (response.code === -1) {
          this.$message.error('登录信息失效');
        } else {
          this.$message.error('系统故障');
        }
      } catch (error) {
        console.error('获取协作者列表失败:', error);
      }
    },
    async fetchTextList() {
      try {
        // Fetch text list from backend
        const session_id = localStorage.getItem('session_id');
        const response = await get_recent_text_list({session_id});
        if (response.code === 0) {
          let files = JSON.parse(response.text_list);
          files.sort((a, b) => new Date(b.update_time) - new Date(a.update_time));

          let dates = [];
          files.forEach(file => {
            const date = this.formatDateToChinese(file.update_time); // Format date to Chinese
            if (!dates.includes(date)) {
              dates.push(date);
            }
          });
          this.recentDaysFiles = dates.map(date => {
            return {
              date: date,
              files: files.filter(file => this.formatDateToChinese(file.update_time) === date)
            };
          });
        } else {
          this.$message.error('获取文件列表失败');
        }
      } catch (error) {
        this.$message.error('获取文件列表失败');
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      localStorage.removeItem('session_id');
      this.userName = '';
      this.userAvator = '';
      this.isVIP = false;
      this.$router.push('/UserLogin');
    },
    async changeinfo() {
      this.$router.push('/UserInfo');
    },
     async spend() {
      this.$router.push('/SpendInfo');
    },
    async charge() {
      this.$router.push('/UserCharge');
    },
    handleVIPClick() {
      this.$message({
        message: '该功能尚在开发中，敬请期待。',
        type: 'warning',
      });
    },
  }
};
</script>
<style scoped>
@import '../assets/dingbu.css';
@import '../assets/HomePage.css';

.user-info-content span {
  margin-right: 50px; /* 设定用户名和用户ID之间的距离 */
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

.table-row img.user-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
}

.vip-info {
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  padding: 5px 5px;
  border-radius: 8px; /* 设置圆角 */
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
}

.token-balance {
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-bottom: 20px;
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
.custom-popover {
  position: absolute;
  top: 100%; /* Positioning the popover right below the vip-info */
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
