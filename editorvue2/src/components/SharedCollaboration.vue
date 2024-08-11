<!-- ShareCollaboration.vue -->
<template>
  <div>
    <el-dialog
        :before-close="handleDialogClose"
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        title="分享协作"
        width="40%"
    >
      <div>
        <div class="search-bar">
          <el-input
              v-model="searchUserId"
              clearable
              placeholder="输入用户ID搜索用户"
              suffix-icon="el-icon-search"
          ></el-input>
          <el-button @click.stop.prevent="searchUser">搜索</el-button>
        </div>
      </div>

      <div class="collaborators-list">
        <div class="collaborators-header">
          <span>协作者</span>
        </div>
        <el-table :data="sharedList" style="width: 100%">
          <el-table-column label="头像" prop="avatar" width="100">
            <template slot-scope="scope">
              <img :src="getAvatarUrl(scope.row.avatar)" alt="用户头像" class="user-avatar">
            </template>
          </el-table-column>
          <el-table-column label="用户ID" prop="user_id" width="160">
          </el-table-column>
          <el-table-column label="用户名" prop="user_name" width="160">
          </el-table-column>
          <el-table-column label="权限" prop="priority">
            <template slot-scope="scope">
              <el-select
                  v-model="scope.row.priority"
                  placeholder="请选择权限"
                  @change="updateUserPriority(scope.row)"
              >
                <el-option :value="0" label="只读"></el-option>
                <el-option :value="1" label="可编辑"></el-option>
                <el-option :value="2" label="移除"></el-option>
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
        <el-select v-model="searchResult.priority" class="short-select" placeholder="请设置用户权限">
          <el-option :value="0" label="只读"></el-option>
          <el-option :value="1" label="可编辑"></el-option>
        </el-select>
        <el-button class="confirm-button" @click.stop.prevent="updateUserPriority1">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {get_shared_list, get_user_list_by_id, set_shared_priority} from "@/api/ShareFile";

export default {
  name: 'ShareCollaboration',
  data() {
    return {
      dialogVisible: false,
      searchUserId: "",
      searchResult: null,
      sharedList: [],
      showUserInfo: false,
      file_id: '',
    };
  },
  methods: {
    async searchUser() {
      // 搜索用户逻辑
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
      // 获取共享列表逻辑
      console.log("file_id", file_id);
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
    getAvatarUrl(filename) {
      return `http://127.0.0.1:8000/avatar/${filename}`;
    },
    async updateUserPriority(user) {
      // 更新用户权限逻辑
      try {
        const session_id = localStorage.getItem('session_id');
        const file_id = this.file_id; // 获取当前操作的文件ID
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
      // 确认按钮逻辑
      try {
        const session_id = localStorage.getItem('session_id');
        const priorityValue = this.searchResult.priority // 转换为0或1
        const response = await set_shared_priority(session_id, this.file_id, this.searchResult.userId, priorityValue);

        if (response.code === 0) {
          this.$message.success('设置权限成功');
          this.showUserInfo = false;
          await this.fetchSharedList(this.file_id); // 更新协作者列表
        } else {
          this.$message.error('设置权限失败');
        }
      } catch (error) {
        console.error('设置权限失败:', error);
        this.$message.error('设置权限失败');
      }
    },
    handleDialogClose() {
      this.dialogVisible = false;
    },
    openDialog(fileId) {
      this.file_id = fileId;
      this.dialogVisible = true;
      this.fetchSharedList(fileId);

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

.el-overlay {
  display: none;
}

/* 自定义 el-dialog 的外观 */
.el-dialog__wrapper {
  background: none;
}
</style>

