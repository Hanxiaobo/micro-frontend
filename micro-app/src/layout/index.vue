<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device === 'mobile' && opened" class="drawer-bg" @click="handleClickOutside" />
    <!--侧边栏-->
    <!-- <Sidebar /> -->
    <!--主体内容-->
    <div class="main-container">
      <!-- <div class="main-container-fixed">
        <TagsView />
      </div> -->
      <!--主页面-->
      <AppMain />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'
import AppMain from './components/AppMain.vue'

const route = useRoute()
const mobileWidth = ref(992)

const opened = computed(() => store.state.app.sidebar.opened)
const themes = computed(() => store.state.app.themes)
const withoutAnimation = computed(() => store.state.app.sidebar.withoutAnimation)
const device = computed(() => store.state.app.device)
const classObj = computed(() => {
  return {
    hideSidebar: !opened.value,
    openSidebar: opened.value,
    withoutAnimation: withoutAnimation.value,
    mobile: device.value === 'mobile',
    dark: themes.value === 'dark'
  }
})

watch(route, () => {
  if (device.value === 'mobile' && opened.value) {
    store.dispatch('app/closeSideBar', false)
  }
})

onBeforeMount(() => {
  window.addEventListener('resize', resizeHandler)
})

onMounted(() => {
  const isMob = isMobile()
  if (isMob) {
    store.dispatch('app/toggleDevice', 'mobile')
    store.dispatch('app/closeSideBar', true)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})

const handleClickOutside = () => {
  store.dispatch('app/closeSideBar', false)
}

const isMobile = (): boolean => {
  const rect = document.body.getBoundingClientRect()
  return rect.width - 1 < mobileWidth.value
}

const resizeHandler = () => {
  if (!document.hidden) {
    const isMob = isMobile()
    store.dispatch('app/toggleDevice', isMob ? 'mobile' : 'desktop')

    if (isMob) {
      store.dispatch('app/closeSideBar', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }

  .main-container {
    position: relative;
    height: 100%;
    // height: calc(100% - 51px);
    overflow: auto;
    // padding-top: $headerHeight;
    margin-left: $sideBarWidth;
    background-color: #f0f2f5;
    transition: margin-left 0.28s;

    .main-container-fixed {
      position: sticky;
      top: 0;
      right: 0;
      left: $sideBarWidth;
      z-index: 1500;
      transition: margin-left 0.28s;
    }
  }

  .drawer-bg {
    position: absolute;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.3;
  }
}
</style>
