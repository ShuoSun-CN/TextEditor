<template>
  <div class="file-list-page">
    <!-- 顶部行 -->
    <div class="top-row">
      <!-- Logo 和 标题 -->
      <div class="logo-and-title">
        <img alt="logo" class="logo" src="../assets/logo.png">
        <span class="title2">文曲星编辑器</span>
      </div>
      <!-- 搜索栏 -->
      <div class="top-search-bar">
        <input v-model="searchQuery" placeholder="搜索文件" type="text">
      </div>
      <!-- 用户信息 -->
      <div class="user-info">
        <img v-if="userAvator" :src="userAvator" alt="用户头像" class="user-avator">
        <img v-if="isVIP" alt="VIP 图标" class="vip-icon" src="../assets/icons/vip.svg">
        <el-dropdown>
          <span class="el-dropdown-link">
            用户名：{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeinfo">
              <img class="button-icon2" src="../assets/icons/xiugaixinxi.svg"> 修改信息
            </el-dropdown-item>
            <el-dropdown-item @click.native="charge">
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

    <!-- 一左一右显示的两个区域 -->
    <div class="content-container">
      <!-- 左侧列 -->
      <div class="all">
        <div class="new-column">
          <!-- 创建文件按钮 -->
          <button class="action-button1" @click="MyEditor">
            <img alt="创建文件图标" class="button-icon" src="../assets/icons/createfile.svg"> 创建文件
          </button>
          <!-- 最近文件按钮 -->
          <button class="action-button" @click="RecentFile">
            <img alt="最近文件图标" class="button-icon" src="../assets/icons/history.svg"> 最近文件
          </button>
          <!-- 共享文件按钮 -->
          <button class="action-button">
            <img alt="共享文件图标" class="button-icon" src="../assets/icons/share.svg"> 共享文件
          </button>
          <!-- 全部文件按钮 -->
          <button class="action-button" @click="AllFile">
            <img alt="全部文件图标" class="button-icon" src="../assets/icons/allfile.svg"> 全部文件
          </button>
          <button class="action-button" @click="AllFile">
            <img alt="全部文件图标" class="button-icon" src="../assets/icons/AI.svg"> AI写作
          </button>
        </div>
      </div>
      <!-- 右侧文件列表区域 -->
      <div class="file-list-container">
        <div class="filemanagement">
          <div class="biaoti2">最近文件</div>
          <!-- 删除选中文件按钮 -->
          <button class="action-button6" @click="deleteSelectedFiles">
            <img alt="删除文件图标" class="button-icon2" src="../assets/icons/delete.svg">
            <span class="no-selected-text">删除选中文件</span>
          </button>
        </div>

        <div v-if="loading" class="loading-icon">
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
        <div v-else>
          <div v-for="(dayFiles, index) in recentDaysFiles" :key="index">
            <div class="biaoti3">{{ dayFiles.date }}</div>
            <div class="file-list">
              <div
                  v-for="file in dayFiles.files"
                  :key="file.file_id"
                  class="file-card"
                  @mouseenter="file.hovered = true"
                  @mouseleave="file.hovered = false"
                  @click.stop="toggleSelection(file)"
              >
                <div class="file-content" @click.stop="openFile(file)">
                  <img alt="文件图标" class="file-icon" src="../assets/icons/file.svg">
                  <div class="file-info">
                    <div class="file-name">{{ file.file_name }}</div>
                    <div class="file-details">
                      <span class="file-time">更新时间:{{ file.update_time }}</span>
                      <span class="file-creator">创作者:{{ file.user_id }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="file.hovered || file.isSelected" class="selection-box">
                  <input v-model="file.isSelected" class="boxxx" type="checkbox" @change="updateSelectedFiles"
                         @click.stop>
                </div>
                <div class="buttonDrop-container">
                  <button class="buttonDrop" @click.stop="showDropdownMenu(file)">
                    <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img class="threepoint-icon" src="../assets/icons/threepoint.svg">
        </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-connection" @click.native="ShareOperation(file)">共享协作</el-dropdown-item>
                        <el-dropdown-item @click.native="Rename(file)" icon="el-icon-s-operation">重命名
                        </el-dropdown-item>

                        <el-dropdown-item icon="el-icon-delete" @click.native="Delete(file)">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {MessageBox} from 'element-ui';
import {get_user_info} from '@/api/UserFile'; // 假设这是从后端获取用户信息的 API
import {create_text, delete_own_text, delete_own_text_list, get_text_list, rename_text} from '@/api/FileManage'; // 假设这是从后端获取文件列表的 API

export default {
  name: 'FileListPage',
  data() {
    return {
      searchQuery: '', // 搜索框输入
      userName: '', // 用户名
      userAvator: '', // 用户头像URL
      isVIP: false, // 用户是否是VIP
      tableData: [], // 存储从后端获取的文件列表信息
      selectedFiles: [], // 存储选中的文件
      loading: true, // 加载状态
      recentDaysFiles: [], // 存储最近三个不同日期的文件列表
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
  methods: {
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
          this.$router.push({path: '/MyEditor', query: {file_id: response.file_id}});
        }
      } catch (error) {
        console.error('创建文件失败:', error);
      }
    },
    async AllFile() {
      this.$router.push('/AllFile');
    },
    async RecentFile() {
      this.$router.push('/RecentFile');
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
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },

    showDropdownMenu(file) {
      // 隐藏所有文件的菜单
      this.recentDaysFiles.forEach(dayFiles => {
        dayFiles.files.forEach(f => {
          this.$set(f, 'showMenu', false);
        });
      });
      // 显示当前文件的菜单
      this.$set(file, 'showMenu', true);
    },
    async Rename(file) {
      const {value} = await MessageBox.prompt('请输入新文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: file.file_name,
        inputPattern: /.+/,
        inputErrorMessage: '文件名不能为空'
      });

      if (value) {
        try {
          // 假设你有一个API方法来处理文件重命名
          const session_id = localStorage.getItem('session_id');
          const response = await rename_text(session_id, file.file_id, value);

          if (response.code === 0) {
            this.$message.success('重命名成功');
            file.file_name = value; // 更新本地文件名
          } else if (response.code === -1) {
            this.$message.error('登录信息过期');
          } else if (response.code === 2) {
            this.$message.error("文件不存在，非法的文件访问");
          } else if (response.code === 3) {
            this.$message.error("当前用户无法重命名该文件");
          }
        } catch (error) {
          console.error('重命名文件失败:', error);
          this.$message.error('重命名失败');
        }
      } else {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      }
    },

    async Delete(file) {
      const session_id = localStorage.getItem('session_id');
      const response = await delete_own_text(file.file_id, session_id);
      if (response.code === 0) {
        this.$message.success('删除成功');
        await this.fetchTextList(); // 重新获取文件列表
        this.selectedFiles = []; // 清空选中文件数组
        window.location.reload();

      } else if (response.code === -1) {
        this.$message.error('登录信息过期');
      } else if (response.code === 2) {
        this.$message.error('文件不存在，非法的文件访问');
      } else if (response.code === 3) {
        this.$message.error('当前用户无权删除该文件');
      }
    },
   /*async ShareOperation(file){

   },*/
    async fetchTextList() {
      try {
        // Fetch text list from backend
        const session_id = localStorage.getItem('session_id');
        const response = await get_text_list({session_id});
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

          dates = dates.slice(0, 5);

          this.recentDaysFiles = dates.map(date => {
            return {
              date: date,
              files: files.filter(file => this.formatDateToChinese(file.update_time) === date)
            };
          });
        } else {
          this.$message.error('Failed to fetch file list');
        }
      } catch (error) {
        console.error('Failed to fetch file list:', error);
        this.$message.error('Failed to fetch file list');
      } finally {
        this.loading = false;
      }
    },
    openFile(file) {
      if (!file.isSelected) {
        this.$router.push({path: '/MyEditor', query: {file_id: file.file_id}});
      }
    },
    toggleSelection(file) {
      file.isSelected = !file.isSelected;
      this.updateSelectedFiles(); // 更新选中文件数组
    },
    updateSelectedFiles() {
      this.selectedFiles = this.recentDaysFiles
          .flatMap(dayFiles => dayFiles.files)
          .filter(file => file.isSelected);
    },
    async deleteSelectedFiles() {
      if (this.selectedFiles.length === 0) {
        this.$message.warning('请选择要删除的文件');
        return;
      }

      try {
        const fileIds = this.selectedFiles.map(file => file.file_id);
        const session_id = localStorage.getItem('session_id');
        let response;

        if (fileIds.length === 1) {
          response = await delete_own_text(fileIds[0], session_id);
        } else {
          response = await delete_own_text_list(fileIds, session_id);
        }

        if (response.code === 0) {
          this.$message.success('删除成功');
          await this.fetchTextList(); // 重新获取文件列表
          this.selectedFiles = []; // 清空选中文件数组
          window.location.reload();

        } else if (response.code === -1) {
          this.$message.error('登录信息过期');
        } else if (response.code === 2) {
          this.$message.error('文件不存在，非法的文件访问');
        } else if (response.code === 3) {
          this.$message.error('当前用户无权删除该文件');
        }
      } catch (error) {
        console.error('删除文件失败:', error);
        this.$message.error('删除失败');
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
    async charge() {
      this.$router.push('/UserCharge');
    },

    async aiWriting() {
      // 处理AI写作逻辑
    }
  }
};
</script>


<style scoped>
@import '../assets/dingbu.css';

.divider1 {
  border: none;
  border-top: 2px solid #e1e0e0;
  margin: 0;
  width: 100%;
  z-index: 9;
}

.button-icon2 {
  width: 15px; /* Icon width */
  height: 15px; /* Icon height */
  margin-right: 10px; /* Space between icon and text */
}

.filemanagement {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 使内容在水平轴上分散对齐 */
  padding: 10px 0; /* 上下内边距 */
  margin-left: 5px;
}

.file-content {
  display: flex;
  align-items: center;
}

.biaoti2 {
  font-size: 16px;
  font-weight: bold; /* 加粗字体 */
  margin-bottom: 5px;
}

.action-button6 {
  display: flex;
  align-items: center;
  padding: 5px 10px; /* 按钮内边距 */
  margin-left: 10px; /* 按钮间距 */
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: white;
}

.disabled-button {
  color: red;
}

.no-selected-text {
  color: red;
}

.additional-buttons .action-button5 {
  display: flex;
  align-items: center; /* 图标和文字垂直居中对齐 */
  height: 70px; /* 调整高度以适应两行文本 */
  width: 300px;
  margin-left: 5px;
  margin-right: 50px;
  background-color: white;
  margin-bottom: 20px;
  border: 1px solid rgb(128, 128, 128); /* 添加灰色边框 */
  border-radius: 10px; /* 添加圆角 */
  padding: 10px; /* 添加内边距 */
  transition: background-color 0.3s, color 0.3s; /* 添加过渡效果 */
}

.additional-buttons .action-button5:hover {
  background-color: #e6e6e6; /* 悬浮时背景变黑 */
}

.button-icon1 {
  width: 40px; /* 图标宽度 */
  height: 40px; /* 图标高度 */
  margin-right: 30px; /* 图标与文本的间距 */
}

.text-container {
  display: flex;
  flex-direction: column; /* 使文字垂直排列 */
  text-align: left
}

.main-text {
  font-size: 16px; /* 增大字体 */
  font-weight: bold; /* 加粗 */
}

.sub-text {
  font-size: 14px; /* 调整字体大小 */
  color: rgb(128, 128, 128); /* 灰色字体 */
  margin-top: 8px; /* 与主文本的间距 */
}


.action-button,
.action-button1 {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 1px;
  text-align: left; /* 左对齐 */
  line-height: 1; /* 垂直居中 */
  border: 1px solid #e1e0e0; /* 右边框为灰色 */
  background-color: white;
}

.action-button1 {
  color: black;
  background-color: #Accbee;
  font-weight: bold; /* 字体加粗 */
  margin-bottom: 30px; /* 创建文件按钮下方的间距 */
}
.action-button1:hover{
  background-color: #A3bded;
}
.action-button:hover{
  background-color: #A3bded;
}

.buttonDrop {
  background-color: white;
  width: 20px;
  height: 25px;
  margin-left: 5px;
  border: none;
}

.buttonDrop-container {
  margin-left: auto; /* 将按钮推到右侧 */
}

.biaoti1 {
  font-size: 18px;
  padding: 5px;
  margin-left: 5px;
  margin-bottom: 3px;
  margin-top: 10px;
}

.biaoti3 {
  font-size: 18px;
  padding: 5px;
  margin-left: 10px;
  margin-bottom: 0;
  margin-top: 5px;
}

.action-button5 {
  height: 80px;
  width: 300px;
  margin-right: 50px; /* 让按钮之间有一些间距 */
  background-color: white;
  margin-bottom: 20px;
}

.batch-actions {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.file-list-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 80%; /* 调整为剩余宽度 */
  margin-left: 20%; /* 避开左侧固定区域 */
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
}

.loading-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 54px;
}

.kuaisufangwen {
  background-color: white;
  margin-top: 4px;
}

.additional-buttons {
  display: flex; /* 让按钮在同一行显示 */
  flex-direction: row;
  align-items: center;
  padding: 5px;
  width: 98%;
  justify-content: left;
}

.file-thumbnail img {
  width: 200px;
  height: 250px;
  object-fit: contain;
  margin-bottom: 5px;
}

.button-icon {
  width: 25px; /* 图标宽度 */
  height: 25px; /* 图标高度 */
  margin-right: 55px; /* 图标和文本之间的间距 */
}

.file-list {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  gap: 10px; /* 方块之间的间距 */
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 20px;
}

.file-card {
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 30%; /* 每行三个方块 */
  margin-right: 15px;
  padding: 7px;
  border: 1px solid #e1e0e0;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  transition: transform 0.2s;
}

.file-card:hover {
  transform: scale(1.05);
}

.selection-box {
  position: relative; /* 从 absolute 改为 relative */
  margin-left: auto; /* 调整位置使其对齐 */
  display: flex; /* 使用 Flex 布局 */
  align-items: center;
  margin-right: 10px; /* 根据需要调整 */
}


.file-card:hover .selection-box {
  display: block; /* 鼠标悬浮时显示 */
}

.selection-box input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.file-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.file-info {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #595757; /* 文件名字体为黑色 */
}
.file-details {
  font-size: 12px;
  color: #888;
}
.file-time {
  margin-right: 8px;
}
.boxxx {
  margin-right: 5px;
}
.threepoint-icon {
  height: 25px;
  width: 20px
}
</style>
