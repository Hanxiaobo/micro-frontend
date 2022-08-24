<template>
  <div class="sidebar-container">
    <!-- <div class="logo" @click="$router.push('/')">
      <transition name="fade-transform" mode="out-in">
        <div class="flex-center">
          <img class="logo-img" src="@/assets/img/logo.png" alt="logo" />
          <h1 v-show="opened" class="logo-text">自助查询</h1>
        </div>
      </transition>
    </div> -->
    <Hamburger class="hamburger-container" :is-active="opened" @toggleClick="toggleSideBar" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :router="true"
        class="v-enter-to"
        :default-active="$route.path"
        :collapse="isCollapse"
        :show-timeout="200"
        text-color="#303133"
        background-color="#ffffff"
        active-text-color="#409EFF"
      >
        <SidebarItem v-for="item in routerList" :key="item.path" :index="item.path" :nav="item" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import store from '@/store'
import { constantRoutes } from '@/router'
import { getRoles } from '@/utils/auth'
import Hamburger from './Hamburger.vue'
import SidebarItem from './SidebarItem.vue'

const roles = getRoles()
const routerList: any[] = reactive([])

const opened = computed(() => store.state.app.sidebar.opened)
const isCollapse = computed(() => !opened.value)

onMounted(() => {
  filterRoutes()
})
const toggleSideBar = () => {
  store.dispatch('app/toggleSideBar')
}

/**
 * 权限过滤路由
 */
const filterRoutes = () => {
  constantRoutes.forEach((item) => {
    if (item.path === '/') {
      const childrens = item.children as any[]
      routerList.push(...childrens)
    }
  })
  for (let i = 0; i < routerList.length; i++) {
    if (routerList[i].meta && routerList[i].meta.roles && !routerList[i].meta.roles.includes(roles)) {
      routerList.splice(i, 1)
      i--
    }
  }
  filterChildrens(routerList)
}

/**
 * 权限过滤子路由
 */
const filterChildrens = (routers: any) => {
  const childrens: Array<any> = []
  routers.forEach((item: any) => {
    if ((item.meta && !item.meta.roles) || (item.meta && item.meta.roles && item.meta.roles.includes(roles))) {
      childrens.push(item)
      if (item.children) {
        filterChildrens(item.children)
      }
    }
  })
  routers.length = 0
  routers.push(...childrens)
}
</script>

<style lang="scss" scoped="scoped">
#app .sidebar-container {
  background-color: var(--bg-color);
  border-right: 1px solid var(--layout-border-color);
}
#app .sidebar-container .el-menu {
  background-color: var(--bg-color);
}
.hamburger-container {
  position: fixed;
  bottom: 10px;
  z-index: 999;
}
.logo {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  overflow: hidden;
  color: #333;
  text-align: center;
  cursor: pointer;
  background-color: #fff;

  .logo-img {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    display: inline-block;
    height: 50px;
    margin-left: 8px;
    font-size: 20px;
    line-height: 50px;
    color: #333;
  }
}
</style>
