<template>
  <div class="app-main" :class="{ 'child-main': isChild || isMyflow }">
    <Navbar
      :class="{ 'nav-border': isChild || isMyflow, 'is-rawgraphs-header': route.path.indexOf('rawgraphs') > -1 }"
    />
    <div v-if="!childApp" class="app-wrapper">
      <!--主体内容-->
      <div class="main-container">
        <!--侧边-->
        <!-- <Sidebar /> -->
        <!-- 关闭菜单 -->
        <!-- <TagsView /> -->
        <!--主页面-->
        <AppMain />
      </div>
    </div>
    <div
      v-show="childApp && ['bolt'].includes(childApp.name)"
      id="bolt"
      ref="boltMountDom"
      v-loading="true"
      :class="{
        'child-app': childApp && childApp.type === 'qiankun'
      }"
    ></div>
    <div
      v-show="childApp && ['rawgraphs'].includes(childApp.name)"
      id="rawgraphs"
      v-loading="true"
      :class="{
        'child-app': childApp && childApp.type === 'qiankun',
        'is-rawgraphs': route.path.indexOf('rawgraphs') > -1
      }"
    ></div>
    <div
      v-show="childApp && childApp.name === 'dam'"
      id="dam"
      ref="damMountDom"
      v-loading="true"
      :class="{ 'child-app': childApp && childApp.type === 'qiankun' }"
    ></div>
    <div
      v-show="childApp && childApp.name === 'dds'"
      id="dds"
      ref="ddsMountDom"
      v-loading="true"
      :class="{ 'child-app': childApp && childApp.type === 'qiankun' }"
    ></div>
    <div
      v-show="childApp && childApp.name === 'indicator'"
      id="indicator"
      ref="indicatorMountDom"
      v-loading="true"
      :class="{ 'child-app': childApp && childApp.type === 'qiankun' }"
    ></div>
    <iframe
      v-if="childApp && childApp.type === 'iframe'"
      :src="childApp && childApp.entry"
      frameborder="0"
      width="100%"
    ></iframe>
    <Footer v-if="route.path.indexOf('rawgraphs') > -1" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadMicroApp } from 'qiankun'
import watermark from 'watermark-package'
import store from '@/store'
import { getToDo, userApply } from '@/api/main'
import Navbar from './components/Navbar/index.vue'
import AppMain from './components/AppMain.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { qiankunApps } from '../childNodes/apps'
import { actions } from '../childNodes'
import Footer from '../views/main/footer.vue'

const router = useRouter()

const childApp: any = ref(null)
const isChild = ref(false)
const isMyflow = ref(false)
const roleApps = store.state.app.menuList
const setMarker = () => {
  const isDark = window.localStorage.getItem('themes') === 'dark' && window.location.pathname.startsWith('/bolt')
  // w_texts：水印文案数组集合
  watermark.removeWatermark()
  watermark.setWaterMark({
    w_texts: [store.state.user.userInfo.username, store.state.user.userInfo.nickName],
    w_options: {
      w_width: 200,
      w_height: 100,
      w_top: '0px',
      w_left: '0px',
      w_rotateDeg: 15,
      w_font: '0.9rem Arial',
      w_color: isDark ? '#bcbcbc' : '#666',
      w_opacity: '0.1',
      w_zIndex: '100000'
    }
  })
  // '#666'  '#bcbcbc'
}
const indicatorMountDom = ref()
const boltMountDom = ref()
const ddsMountDom = ref()
const damMountDom = ref()
const loadedApps: any = ref([])
watch(
  () => router,
  (newValue) => {
    setMarker()
    const arr = qiankunApps.filter((p) => newValue.currentRoute.value.path.startsWith(p.activeRule))
    childApp.value = arr.length ? arr[0] : null

    if (
      arr.length &&
      (roleApps.some((app: any) => app.name === childApp.value.activeRule) ||
        childApp.value.activeRule === '/rawgraphs')
    ) {
      isChild.value = true
      if (!loadedApps.value.includes(childApp.value.name)) {
        loadMicroApp(childApp.value, {
          sandbox: { strictStyleIsolation: childApp.value.activeRule !== '/rawgraphs' },
          prefetch: false
        })
        loadedApps.value.push(childApp.value.name)
      }
    } else {
      isChild.value = false
    }

    if (newValue.currentRoute.value.path.startsWith('/myflow')) {
      isMyflow.value = true
    } else {
      isMyflow.value = false
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => store.state.app.themes,
  (currentVal, pre) => {
    if (currentVal !== pre) {
      setMarker()
    }
  }
)

const route = useRoute()

onBeforeMount(() => {
  window.addEventListener('resize', setMarker)
})

const timer: any = ref()
onMounted(() => {
  // window.onpopstate = (e: any) => {
  //   const fPath = router.currentRoute.value.fullPath
  //   if (
  //     childApp.value &&
  //     fPath.startsWith(childApp.value.activeRule) &&
  //     fPath !== `${childApp.value.activeRule}${e.state.current}`
  //   ) {
  //     console.log(e, router.currentRoute.value.fullPath, 'router.currentRoute.value.fullPath ')
  //     actions.setGlobalState({ router: e.state.current })
  //   }
  // }
  // getToDo().then((res: any) => {
  //   res.data.flag === 'S' &&
  //     actions.setGlobalState({ hasToDo: res.data.data.approving_count, myDoing: res.data.data.create_count })
  // })
  // timer.value = setInterval(() => {
  //   getToDo().then((res: any) => {
  //     res.data.flag === 'S' &&
  //       actions.setGlobalState({ hasToDo: res.data.data.approving_count, myDoing: res.data.data.create_count })
  //   })
  // }, 10000)

  // 如果没有权限
  if (
    childApp.value &&
    roleApps.every((app: any) => app.name !== childApp.value.activeRule) &&
    childApp.value.activeRule !== '/rawgraphs'
  ) {
    ElMessageBox.confirm(
      `您当前没有${childApp.value.text}系统的访问权限，<br />开通普通角色权限请点击
        一键申请，申请进度可在<br />【工单流程=>我的流程】页面查看` as string,
      '提示' as string,
      {
        type: 'info',
        showConfirmButton: true,
        confirmButtonText: '一键申请',
        showCancelButton: true,
        dangerouslyUseHTMLString: true,
        cancelButtonClass: 'cancelButtonClass',
        autofocus: false,
        callback: async (action: any) => {
          if (action === 'cancel') {
            router.push('/main')
          }
          if (action === 'confirm') {
            await userApply({
              permissionCode: 'general',
              systemCode: 'INDIC'
            })
            ElMessage({
              type: 'success',
              message: '发起申请成功！'
            })
          }
        }
      } as object
    )
  }
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
  window.removeEventListener('resize', setMarker)
})
</script>

<style lang="scss">
.cancelButtonClass {
  padding: 9px 20px;
}
.child-app {
  background: var(--bg-color);
}
.app-main {
  background: linear-gradient(180deg, #ecf3f3 0%, #fbfbfb 100%);
}
.child-main {
  background: var(--bg-color);
}
.nav-border {
  border-bottom: 1px solid var(--layout-border-color);
}
.el-loading-mask {
  background-color: unset;
}
</style>
<style lang="scss" scoped>
.is-rawgraphs-header {
  position: sticky;
  top: 0;
  z-index: 1021;
  padding: 0;
  background: white;
}
.is-rawgraphs-header :deep(.right-menu) {
  height: 50px;
}
.is-rawgraphs {
  height: 100%;
}
.footer {
  position: sticky;
  background: white;
  padding: 10px 0;
  bottom: 0;
  z-index: 1111;
}
.app-wrapper {
  position: relative;
  width: 100%;
  height: calc(100vh - 50px);
  overflow: hidden;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }

  // .main-container {
  //   position: relative;
  //   min-height: 100%;
  //   margin-left: $sideBarWidth;
  //   transition: margin-left 0.28s;
  // }

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
iframe {
  height: calc(100vh - 50px);
}
:deep(.menu-wrapper) {
  margin-bottom: 8px;
}
:deep(.el-menu-item) {
  margin: 4px 0;
  height: 40px;
  line-height: 40px;
}
:deep(.el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
  padding: 0 16px !important;
}

:deep(.el-menu-item:hover) {
  background-color: $themeBgColor;
}

:deep(.el-menu-item .el-icon) {
  font-size: 16px;
  width: 16px;
}

:deep(.el-menu-item.is-active) {
  color: $themeColor;
  background-color: $themeBgColor;
  border-right: 3px solid $themeColor;
}
:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: $themeColor !important;
}
:deep(.el-sub-menu) {
  margin: 4px 0;
}
:deep(.el-sub-menu__icon-arrow) {
  font-size: 15px;
  transform: rotateZ(-90deg);
}
:deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow) {
  font-size: 15px;
  transform: rotateZ(0deg);
}
:deep(.el-sub-menu .el-sub-menu__icon-arrow) {
  right: 12px;
}
</style>
