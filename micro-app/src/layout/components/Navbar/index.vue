<template>
  <div class="navbar" mode="horizontal">
    <Hamburger class="hamburger-container" :is-active="opened" @toggleClick="toggleSideBar" />
    <Breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" height="32" />
          <span>{{ userName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown class="avatar-container-dropdown">
          <el-dropdown-menu>
            <el-dropdown-item divided @click="loginOut">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import store from '@/store'
import Hamburger from './Hamburger.vue'
import Breadcrumb from './Breadcrumb.vue'

const router = useRouter()
const opened = computed(() => store.state.app.sidebar.opened)
const avatar = computed(() => store.state.user.avatar)
const userName = computed(() => store.state.user.name)

const toggleSideBar = () => {
  store.dispatch('app/toggleSideBar')
}

const loginOut = () => {
  ElMessageBox.confirm('退出登录', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      store.dispatch('user/logout').then(() => {
        router.push('/login')
      })
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
.navbar {
  // position: fixed;
  // top: 0;
  // right: 0;
  // left: $sideBarWidth;
  // z-index: 100000;
  height: 50px;
  overflow: hidden;
  line-height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #efefef;
  transition: margin-left 0.28s;

  .hamburger-container {
    float: left;
    height: 50px;
    padding: 0 10px;
    position: fixed; bottom: 10px; z-index: 999;

  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  :deep(.right-menu) {
    display: flex;
    align-items: center;
    float: right;
    height: 100%;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      margin: 0 4px;
      vertical-align: middle;
    }

    .international {
      vertical-align: top;
    }

    .theme-switch {
      vertical-align: 15px;
    }

    .avatar-container {
      // height: 50px;
      margin-right: 24px;

      .avatar-wrapper {
        display: flex;
        align-items: center;

        .user-avatar {
          width: 32px;
          height: 32px;
          margin-right: 8px;
          cursor: pointer;
          // border-radius: 10px;
        }

        .el-icon-caret-bottom {
          margin-left: 6px;
        }
      }
    }
  }
}
</style>
