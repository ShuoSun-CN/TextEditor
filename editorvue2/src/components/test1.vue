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
      <div class="user-info">
        <img v-if="userAvator" :src="userAvator" alt="用户头像" class="user-avator">
        <el-popover
            ref="vipPopover"
            placement="bottom"
            width="200"
            trigger="hover"
            v-if="isVIP"
            popper-class="custom-popover"
        >
          <p>剩余星币数目: {{ stars }}</p>
          <el-button class="test123" size="mini" @click="handleVIPClick">充值</el-button>
          <div slot="reference" class="vip-info">
            <img alt="VIP 图标" class="vip-icon" src="../assets/icons/vip.svg">
            <span>会员</span>
          </div>
        </el-popover>


        <el-dropdown>
    <span class="el-dropdown-link">
      用户名：{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeinfo">
              <img class="button-icon2" src="../assets/icons/xiugaixinxi.svg"> 修改信息
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
          <button class="action-button" @click="SharedToMe">
            <img alt="共享文件图标" class="button-icon" src="../assets/icons/share.svg"> 共享给我
          </button>
          <!-- 全部文件按钮 -->
          <button class="action-button" @click="AllFile">
            <img alt="全部文件图标" class="button-icon" src="../assets/icons/allfile.svg"> 全部文件
          </button>
          <button class="action-button">
            <img alt="全部文件图标" class="button-icon" src="../assets/icons/AI.svg"> AI 写作
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
        <el-button @click.stop.prevent="updateUserPriority1" class="confirm-button">确定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<style scoped>


</style>
