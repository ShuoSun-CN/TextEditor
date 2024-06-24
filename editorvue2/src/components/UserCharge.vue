<template>
  <el-table
            :data="tableData"
            height="250"
            border
            style="width: 100%">
          <el-table-column
              prop="file_name"
              label="文件名"
              width="480">
          </el-table-column>
          <el-table-column
              prop="user_id"
              label="创建者"
              width="200">
          </el-table-column>
          <el-table-column
              prop="create_time"
              label="创建时间"
              width="250">
          </el-table-column>
          <el-table-column
              prop="update_time"
              label="修改时间"
              width="250">
          </el-table-column>
        </el-table>
</template>
<script>
import {get_text_list} from '@/api/FileManage'; // 假设这是从后端获取文件列表的 API

export default {
  name: 'FileListPage',
  data() {
    return {
      tableData: [] // 存储从后端获取的文件列表信息
    };
  },
  async created() {
    await this.fetchUserInfo(); // 获取用户信息
    await this.fetchTextList(); // 获取文件列表信息
  },
  methods: {
    async fetchTextList() {
      try {
        const session_id = localStorage.getItem('session_id');
        const response = await get_text_list({session_id: session_id});
        if (response.code === 0) {
         this.tableData = []; // 先清空数据
         this.tableData = response.text_list; // 直接赋值给响应式数组
        } else {
          this.$message.error('获取文件列表失败');
        }
      } catch (error) {
        console.error('获取文件列表失败:', error);
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
    async quickCreate() {
      // 处理快速创建逻辑
    },
    async aiWriting() {
      // 处理AI写作逻辑
    }
  }
};
</script>