<template>
  <div class="sidebar-container">
    <!-- <div class="logo" @click="$router.push('/')">
      <img class="logo-img" :src="require('@img/logo.png')" alt="logo" />
      <transition name="fade-transform" mode="out-in">
        <h1 v-show="opened" class="logo-text">child-app</h1>
      </transition>
    </div> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :router="true"
        class="v-enter-to"
        :default-active="$route.path"
        :collapse="isCollapse"
        :show-timeout="200"
        text-color="#fff"
        background-color="#4a5a74"
        active-text-color="#409EFF"
      >
        <SidebarItem v-for="item in routerList" :key="item.path" :index="item.path" :nav="item" />
      </el-menu>
    </el-scrollbar>
    <Hamburger class="hamburger-container" :is-active="opened" @toggleClick="toggleSideBar" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import store from '@/store'
import { constantRoutes } from '@/router'
import { getRoles } from '@/utils/auth'
import SidebarItem from './SidebarItem.vue'
import Hamburger from './Hamburger.vue'

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
.hamburger-container {
  position: absolute;
  top: 0;
  right: -40px;
}
</style>
