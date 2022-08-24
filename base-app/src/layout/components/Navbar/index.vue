<template>
  <div class="main-navbar" :class="{ 'navbar-dark': currentMenu.startsWith('/bolt') && isDark }" mode="horizontal">
    <router-link to="/main">
      <div class="logo">
        <img
          class="logo-img"
          :src="require(currentMenu.startsWith('/bolt') && isDark ? '@img/dark_logo.png' : '@img/logo.png')"
          alt="logo"
        />
        <!-- <h1 class="logo-text">毓数2.0</h1> -->
      </div>
    </router-link>

    <div class="navbar-right">
      <!-- <Breadcrumb class="breadcrumb-container" /> -->
      <!-- <TagsView /> -->
      <div class="left-menu">
        <div class="menu-list">
          <!-- <router-link to="/"><span :class="{'selected': currentMenu.startsWith('/main')}">首页</span></router-link> -->
          <template v-for="(item, index) in menus">
            <template v-if="item.openNewTab">
              <a :key="index" :href="item.name" target="_blank" :class="{ DEBIT_NOTE_REPORT: item.title === '123' }">
                <span v-if="item.title !== '123'">{{ item.title }}</span>
              </a>
            </template>
            <router-link v-else :key="index + 'r'" :to="item.name">
              <span
                :class="{
                  selected:
                    currentMenu.startsWith(item.name) || (currentMenu.startsWith('/rawgraphs') && item.name === '/bolt')
                }"
              >{{ item.title }}</span>
            </router-link>
          </template>
        </div>
      </div>
      <div class="right-menu">
        <I name="Document" class="gdlc" :size="14"></I>
        <el-badge :hidden="hasToDo + myDoing === 0" :value="hasToDo + myDoing" class="badge-item" :max="99">
          <router-link :to="hasToDo ? '/myflow/taskTodo' : '/myflow/process'">
            <span class="gdlc">工单流程</span>
          </router-link>
        </el-badge>
        <el-dropdown class="avatar-container right-menu-item">
          <div class="avatar-wrapper">
            <img :src="require('@img/photo.png')" class="user-avatar" />
            <span class="user-name">{{ nickName }}</span>
            <I name="ArrowDown" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item
                v-if="roles.length"
                @click="$router.push('/myflow')"
              ><span :class="{ 'info-tip-myflow': hasToDo > 0 }">我的流程</span></el-dropdown-item> -->
              <el-dropdown-item
                v-if="currentMenu.startsWith('/bolt')"
                @click="toggleDark"
              >{{ isDark ? '浅色' : '深色' }}模式</el-dropdown-item>
              <el-dropdown-item @click="loginOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
// import { ElMessage } from 'element-plus'
import store from '@/store'
// import { delete_sc } from '@/api/main'
import { actions } from '../../../childNodes'
// import { roleApps } from '../../../childNodes/apps'
const isDark = ref(!!window.localStorage.getItem('themes'))
const toggleDark = () => {
  isDark.value = !isDark.value
  window.document.documentElement.setAttribute('class', isDark.value ? 'dark' : '')
  window.localStorage.setItem('themes', isDark.value ? 'dark' : '')
  actions.setGlobalState({ themes: isDark.value ? 'dark' : '' })
}
const hasToDo = computed(() => {
  // actions.setGlobalState({ hasToDo: store.state.app.hasToDo, myDoing: store.state.app.myDoing })
  return store.state.app.hasToDo
})
const myDoing = computed(() => {
  return store.state.app.myDoing
})
// const roles = store.state.user.userInfo.roleList
const menus = computed(() => {
  // const arr: any = []
  // roleApps.forEach((app) => {
  //   if (roles.some((r: { productCode: string }) => r.productCode === app.productCode)) {
  //     arr.push(app)
  //   }
  // })
  // return arr
  return store.state.app.menuList
})
const router = useRouter()
const currentMenu = ref('/')
watch(
  () => router,
  (newValue) => {
    currentMenu.value = newValue.currentRoute.value.path
    if (currentMenu.value.startsWith('/bolt')) {
      window.document.documentElement.setAttribute('class', window.localStorage.getItem('themes') || '')
      isDark.value = !!window.localStorage.getItem('themes')
    } else {
      window.document.documentElement.setAttribute('class', '')
    }
  },
  { immediate: true, deep: true }
)
const nickName = computed(() => store.state.user.userInfo.nickName)
// const collectApps = computed(() => {
//   const arr: any = []
//   store.state.app.appList.forEach((item: any) => {
//     item.child.forEach((cItem: any) => {
//       if (cItem.isCollect) {
//         arr.push(cItem)
//       }
//     })
//   })
//   return arr
// })

// const openNewsModal = () => {
//   store.dispatch('app/toggleNewsModal', true)
// }

const loginOut = () => {
  store.dispatch('user/logout')
}
</script>

<style lang="scss" scoped>
.gdlc {
  color: var(--text-color-regular);
}
:deep(.el-badge__content--danger) {
  background-color: #ff5555;
  right: 5px;
  top: 2px;
}
.badge-item {
  margin-right: 32px;
  height: 32px;
  line-height: 32px;
  color: #262626;
  font-size: 14px;
  margin-left: 2px;
}
.info-tip-myflow {
  position: relative;
}
.info-tip-myflow::after {
  content: '';
  background: rgba(250, 60, 0, 1);
  position: absolute; /*根据父元素绝对定位*/
  width: 7px;
  height: 7px;
  top: 0;
  right: -5px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}
.info-tip {
  position: relative;
}
.info-tip::after {
  content: '';
  background: rgba(250, 60, 0, 1);
  position: absolute; /*根据父元素绝对定位*/
  width: 7px;
  height: 7px;
  top: -5px;
  right: -5px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}
.DEBIT_NOTE_REPORT {
  display: inline-block;
  width: 88px;
  height: 30px;
  background: url('~@img/jtzb.png');
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  top: 10px;
  margin-right: 13px;
}
.navbar-dark {
  background: var(--bg-color);
}
.main-navbar {
  height: 50px;
  overflow: hidden;
  line-height: 50px;
  display: flex;
  // border-bottom: 1px solid #d8dce5;
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .navbar-right {
    flex: 1;
    display: flex;
  }
  .hamburger-container {
    float: left;
    height: 50px;
    padding: 0 10px;
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
    .avatar-container:hover :deep(.el-icon) {
      transform: rotate(180deg);
    }

    .avatar-container {
      // height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 10px;
        }
        .user-name {
          margin: 0 5px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          top: 20px;
          right: -16px;
          font-size: 12px;
        }
      }
    }
  }
}
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 148px;
  margin-right: 20px;
  height: 49px;
  // margin-left: 24px;
  // margin-right: 22px;
  text-align: center;
  cursor: pointer;

  .logo-img {
    width: 100px;
    height: 40px;
  }

  .logo-text {
    display: inline-block;
    height: 50px;
    margin-left: 12px;
    font-size: 16px;
    line-height: 50px;
  }
}
.left-menu {
  flex: 1;
  font-weight: 400;
  color: #303133;
  line-height: 49px;
  .menu-list {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    // color: #595959;
    color: var(--text-color-regular);
    line-height: 50px;
    // margin-left: 25px;
    .selected {
      border-bottom-width: initial;
      color: #00b85c;
      background: #00b85c21;
      border-radius: 2px;
    }
    .selected::after {
      width: 100%;
      left: 0;
    }
    span {
      margin-right: 13px;
      padding: 0 17px;
      display: inline-block;
      height: 32px;
      line-height: 32px;
      position: relative;
    }
    // span::after {
    //   position: absolute;
    //   content: '';
    //   background: #00b85c;
    //   height: 2px;
    //   width: 0;
    //   bottom: 0;
    //   left: 50%;
    //   transition: all 0.6s;
    // }
  }
  .nav-title {
    margin-right: 16px;
    color: #595959;
    .arrow {
      transform: rotate(180deg);
    }
  }
}
.myBtn {
  margin-right: 16px;
  color: #595959;
  :hover .closeBtn {
    visibility: visible;
  }
  :hover {
    color: var(--el-color-primary);
  }
  .closeBtn {
    visibility: hidden;
    // background: #bbbdbe;
    border-radius: 50%;
    background: white;
    margin-left: 5px;
    color: #bbbdbe;
    margin-bottom: 3px;
    :hover {
      color: #bbbdbe;
    }
  }
}
</style>
