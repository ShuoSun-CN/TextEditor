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
        <div class="kuaisufangwen">
          <div class="biaoti1">快速访问</div>
          <div class="additional-buttons">
            <button class="action-button5" @click="MyEditor">
              <img alt="快速创建图标" class="button-icon1" src="../assets/icons/createfile1.svg">
              <div class="text-container">
                <div class="main-text">快速创建</div>
                <div class="sub-text">从空文本起草</div>
              </div>
            </button>
            <button class="action-button5" @click="aiWriting">
              <img alt="AI写作图标" class="button-icon1" src="../assets/icons/aifile.svg">
              <div class="text-container">
                <div class="main-text">AI写作</div>
                <div class="sub-text">让AI辅助您高效写作</div>
              </div>
            </button>
          </div>
          <hr class="divider1">
        </div>
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
                        <el-dropdown-item icon="el-icon-connection" @click.native="ShareOperation(file)">共享协作
                        </el-dropdown-item>
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
    <el-dialog
        title="分享协作"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleDialogClose"
    >
      <div>
        <div class="search-bar">
          <el-input
              placeholder="输入用户ID搜索用户"
              v-model="searchUserId"
              suffix-icon="el-icon-search"
              clearable
          ></el-input>
          <el-button @click.stop.prevent="searchUser">搜索</el-button>
        </div>
      </div>

      <div class="collaborators-list">
        <div class="collaborators-header">
          <span>协作者</span>
        </div>
        <el-table :data="sharedList" style="width: 100%">
          <el-table-column prop="avatar" label="头像" width="100">
            <template slot-scope="scope">
              <img :src="getAvatarUrl(scope.row.avatar)" class="user-avatar" alt="用户头像">
            </template>
          </el-table-column>
          <el-table-column prop="user_id" label="用户ID" width="160">
          </el-table-column>
          <el-table-column prop="user_name" label="用户名" width="160">
          </el-table-column>
          <el-table-column prop="priority" label="权限">
            <template slot-scope="scope">
              <el-select
                  v-model="scope.row.priority"
                  placeholder="请选择权限"
                  @change="updateUserPriority(scope.row)"
              >
                <el-option label="只读" :value="0"></el-option>
                <el-option label="可编辑" :value="1"></el-option>
                <el-option label="移除" :value="2"></el-option>
              </el-select>
            </template>
          </el-table-column>


        </el-table>
      </div>

      <!-- 显示用户信息 -->
      <div v-if="showUserInfo" class="user-info-display">
        <div class="collaborators-header">
          <span>搜索结果</span>
        </div>
      <div class="user-info-content">
        <span>用户ID: {{ searchResult.userId }}</span>
        <span>用户名: {{ searchResult.userName }}</span>
      </div>
      <el-select v-model="searchResult.priority" placeholder="请设置用户权限" class="short-select">
    <el-option label="只读" :value="0"></el-option>
    <el-option label="可编辑" :value="1"></el-option>
  </el-select>
      <el-button @click.stop.prevent="updateUserPriority1" class="confirm-button" >确定</el-button>
    </div>

    </el-dialog>

  </div>
</template>

<script>
import {MessageBox, Dialog, Input, Button, Select, Option} from "element-ui";
import {get_user_info} from '@/api/UserFile'; // 假设这是从后端获取用户信息的 API
import {create_text, delete_own_text, delete_own_text_list, get_text_list, rename_text} from '@/api/FileManage'; // 假设这是从后端获取文件列表的 API
import {get_user_list_by_id, get_shared_list, set_shared_priority, remove_shared_priority} from "@/api/ShareFile";

export default {
  name: 'FileListPage',
  components: {
    // Register imported Element UI components here if needed
    ElDialog: Dialog,
    ElInput: Input,
    ElButton: Button,
    ElSelect: Select,
    ElOption: Option,
  },
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
      dialogVisible: false, // 分享协作弹窗可见性
      searchUserId: "", // 搜索用户ID
      searchResult: null, // 搜索结果
      currentFile: null, // 当前操作的文件
      sharedList: [], // 协作者列表
      userInfoDialogVisible: false,
      showUserInfo: false, // 控制用户信息显示
      userInfo: null, // 用户信息
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
    getAvatarUrl(filename) {
      return `http://127.0.0.1:8000/avatar/${filename}`; // 根据实际路径修改
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
      const result = await MessageBox.confirm('您确定要删除该文件吗?', '确定删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      if (result === 'confirm') {
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
      } else {
        // 用户点击了“取消”按钮
        this.$message.info('取消移除操作');
      }
    },

    async ShareOperation(file) {
      this.currentFile = file;
      this.dialogVisible = true; // Show dialog when sharing operation is clicked
      await this.fetchSharedList(file.file_id);
    },

    async searchUser() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await get_user_list_by_id(session_id, this.searchUserId);

        if (response.code === 0) {
          this.searchResult = {
            userName: response.user_name,
            userId: response.user_id,
            priority: response.priority // 可能是 0, 1, 2
          };
          this.showUserInfo = true;
        } else if (response.code === -1) {
          this.$message.error('登录过期');
        } else if (response.code === 1) {
          this.$message.error('系统故障');
        } else if (response.code === 2) {
          this.$message.error('未找到该用户');
        }
      } catch (error) {
        console.error('搜索用户失败:', error);
        this.$message.error('搜索用户失败');
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

    handleDialogClose(done) {
      this.dialogVisible = false;
      this.searchUserId = "";
      this.searchResult = null;
      this.currentFile = null;
      this.showUserInfo = false; // 隐藏用户信息
      done();
    },
    async editUserInfo(user) {
      this.userInfo = {
        userId: user.user_id,
        userName: user.user_name,
        priority: user.priority,
      };
      this.showUserInfo = true; // 显示用户信息
    },
    async updateUserPriority(user) {
      try {
        const session_id = localStorage.getItem('session_id');
        const file_id = this.currentFile.file_id; // 获取当前操作的文件ID
        const priorityValue = user.priority; // 获取下拉框选中的权限值
        // 处理权限值
        if (priorityValue === 2) { // 权限值为2时移除协作者
          await this.removeSharedPriority(user);
        } else {
          const response = await set_shared_priority(session_id, file_id, user.user_id, priorityValue);

          if (response.code === 0) {
            this.$message.success('设置权限成功');
          } else {
            this.$message.error('设置权限失败');
          }
        }
      } catch (error) {
        console.error('设置权限失败:', error);
        this.$message.error('设置权限失败');
      }
    },
    async updateUserPriority1() {
      try {
        const session_id = localStorage.getItem('session_id');
        const priorityValue = this.searchResult.priority === '只读' ? 1 : 0; // 转换为0或1
        const response = await set_shared_priority(session_id, this.currentFile.file_id, this.searchResult.userId, priorityValue);

        if (response.code === 0) {
          this.$message.success('设置权限成功');
          this.showUserInfo = false;
          await this.fetchSharedList(this.currentFile.file_id); // 更新协作者列表
        } else {
          this.$message.error('设置权限失败');
        }
      } catch (error) {
        console.error('设置权限失败:', error);
        this.$message.error('设置权限失败');
      }
    },
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
          dates = dates.slice(0, 3);

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
        const result = await MessageBox.confirm('您确定要删除该文件吗?', '确定删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        if (result === 'confirm') {
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
        } else {
          // 用户点击了“取消”按钮
          this.$message.info('取消移除操作');
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
@import '../assets/HomePage.css';

.collaborators-list {
  margin-top: 20px;
}

.collaborators-header {
  font-weight: bold;
  margin-bottom: 20px;
}

.user-info-display {
  margin-top: 20px;
  border-top: 1px solid #e4e4e4;
  padding-top: 10px;
}

.user-info-content {
  display: flex;
  margin-bottom: 10px;
}

.user-info-content span {
  margin-right: 50px; /* 设定用户名和用户ID之间的距离 */
}

.user-avatar {
  width: 40px; /* 修改为合适的宽度 */
  height: 40px; /* 修改为合适的高度 */
  border-radius: 50%;
}

.confirm-button {
  margin-left: 10px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar .el-input {
  flex: 1;
}
.short-select {
  width: 150px; /* 修改为你需要的宽度 */
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
</style>
