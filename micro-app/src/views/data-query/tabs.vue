<template>
  <div class="tab-box" @click="rightMenu = false">
    <div class="tab-head-box" @contextmenu.prevent="rightClick">
      <el-scrollbar ref="scrollbarRef" noresize>
        <div
          v-for="item in tabs"
          :key="item.id"
          :class="{ active: activeTabObj.id === item.id }"
          class="tab-head"
          @click="selectTab(item.id)"
        >
          <span>
            {{ item.title }}
          </span>
          <span v-if="item.content !== item.md5" class="have-change"></span>
          <span v-if="tabs.length > 1" class="close-icon icon" @click.stop="removeItem(item)"></span>
        </div>
      </el-scrollbar>
      <span v-if="tabs.length < 20" class="add-icon icon" @click="addItem({})"></span>
      <el-tooltip class="box-item" effect="dark" :content="'全屏'" :placement="'top'">
        <img
          v-show="!screenState.fullscreen"
          class="quanping"
          :src="require(themes === 'dark' ? '@img/dark_quanping.png' : '@img/icon_quanping.png')"
          alt=""
          @click="toggle"
        />
      </el-tooltip>
      <el-tooltip class="box-item" effect="dark" content="退出全屏" placement="bottom">
        <img
          v-show="screenState.fullscreen"
          class="quanping"
          :src="require(themes === 'dark' ? '@img/dark_suoxiao.png' : '@img/icon_suoxiao.png')"
          alt=""
          @click="toggle"
        />
      </el-tooltip>
    </div>
    <TabBody
      ref="tabsBodyRef"
      :tree-data="treeData"
      :screen-state="screenState.fullscreen"
      @updateGroup="updateGroup"
      @keydown.f11.prevent="toggle"
    />
    <el-dialog v-model="delVisibale.visibale" width="420px" title="提示">
      <div>确定放弃保存SQL？ CTRL+S可保存</div>
      <template #footer>
        <span>
          <el-button text bg @click="delVisibale.visibale = false">取消</el-button>
          <el-button text bg type="primary" @click="delConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="closeVisibale" width="420px" title="提示">
      <div>有未保存SQL查询页，是否全部关闭？</div>
      <template #footer>
        <span>
          <el-button text bg @click="closeVisibale = false">取消</el-button>
          <el-button text bg type="primary" @click="closeConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <div v-show="rightMenu" class="contextMenu" :style="style.position">
      <p @click="closeElse">关闭其他未运行编辑页</p>
    </div>
  </div>
</template>
<script lang="ts">
import { reactive, computed, ref, watch } from 'vue'
import TabBody from './tab-body.vue'
// import { ElMessageBox } from 'element-plus'
import store from '@/store'

export interface DataArrayTypes {
  id: string
  name: string
  content: string
  title: string
  log: Array<[any]>
  result: Array<[any]>
}

export default {
  name: 'Tabs',
  components: {
    TabBody
  },
  props: {
    treeData: {
      type: Array,
      default: () => []
    },
    active: {
      type: String,
      default: ''
    },
    screenState: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['add-tab', 'select-tab', 'remove-tab', 'updateGroup', 'keydown', 'toggle'],
  setup(props: any, context: any) {
    console.log(props, 'props')
    const delVisibale = reactive({
      visibale: false,
      value: {}
    })
    const scrollbarRef = ref<any | HTMLElement>(null)

    const tabsBodyRef = ref<any | HTMLElement>(null) // tabs ref
    // const activeTabObj = computed(() => props.data.filter((i: any) => i.id === props.active)[0])
    const activeTabObj = computed(() => store.state.app.currentTab)
    const tabs = computed(() => {
      return store.state.app.tabs
    })
    watch(
      () => store.state.app.tabs,
      () => {
        setTimeout(() => {
          scrollbarRef.value!.setScrollLeft(5000)
        }, 100)
      },
      {
        deep: true
      }
    )
    const themes = computed(() => store.state.app.themes)
    const addTab = (obj: any) => {
      context.emit('add-tab', obj)
    }
    const removeTab = (id: String) => {
      context.emit('remove-tab', id)
    }
    const selectTab = (id: String) => {
      store.dispatch('app/selectTab', id)
    }
    const updateGroup = () => {
      context.emit('updateGroup')
    }
    const toggle = () => {
      context.emit('toggle')
    }
    const addItem = (obj: object) => {
      context.emit('add-tab', obj)
    }
    const removeItem = (d: any) => {
      const obj = d
      if (!obj.content || obj.content === obj.md5) {
        // 判断下当为空的时候或者没有修改的时候直接关闭
        context.emit('remove-tab', d.id)
        return
      }
      delVisibale.visibale = true
      delVisibale.value = d.id
    }
    const delConfirm = () => {
      context.emit('remove-tab', delVisibale.value)
      delVisibale.visibale = false
    }
    const setTabels = (obj: any) => {
      tabsBodyRef.value!.setTabels(obj)
    }
    const setObj = (arr: any) => {
      return tabsBodyRef.value!.setObj(arr)
    }
    const consoleUp = () => {
      tabsBodyRef.value!.previwHanleUp()
    }
    const getGroupList = () => {
      tabsBodyRef.value!.getGroupList()
    }
    const rightMenu = ref(false)
    const style = reactive({
      position: { top: '0', left: '0' }
    })
    const rightClick = (ev: any) => {
      if (tabs.value.length > 1) {
        rightMenu.value = true
        style.position = {
          top: ev.clientY + 'px',
          left: ev.clientX + 'px'
        }
        return false
      }
    }
    const closeVisibale = ref(false)
    const closeElse = () => {
      const hasNotSave = tabs.value.some((tab: any) => tab.id !== activeTabObj.value.id && tab.content !== tab.md5)
      if (hasNotSave) {
        closeVisibale.value = true
      } else {
        closeConfirm()
      }
    }
    const closeConfirm = () => {
      store.dispatch('app/closeOthers')
      closeVisibale.value = false
    }
    return {
      scrollbarRef,
      tabsBodyRef,
      activeTabObj,
      addItem,
      removeItem,
      delConfirm,
      toggle,
      addTab,
      removeTab,
      selectTab,
      updateGroup,
      consoleUp,
      setObj,
      setTabels,
      getGroupList,
      themes,
      delVisibale,
      tabs,
      rightClick,
      style,
      rightMenu,
      closeElse,
      closeVisibale,
      closeConfirm
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-head-box :deep(.el-scrollbar__view) {
  display: flex;
}
.tab-head-box {
  position: relative;
  border-bottom: 1px solid var(--tab-border-color);
  border-left: 1px solid var(--tab-border-color);
  background: var(--bg-color);
  border-radius: 2px 2px 0px 0px;
  padding-right: 32px;
  user-select: none;
  display: flex;
  // overflow: scroll;
}
.tab-head {
  display: inline-block;
  flex-shrink: 0;
  padding: 4px 16px;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: var(--tab-color);
  cursor: pointer;
  border-right: 1px solid var(--tab-active-border-color);
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  line-height: 22px;
  background: var(--bg-color);
  border-radius: 2px 2px 0px 0px;
}
.tab-head:last-child {
  border-right: none;
}
.active {
  border-top: 2px solid #01b85c;
  color: #01b85c;
  background: var(--tab-active);
  border-radius: 2px 2px 0px 0px;
}
.icon {
  width: 12px;
  height: 12px;
  background-size: contain;
  background-repeat: no-repeat;
}
.close-icon {
  display: inline-block;
  margin-left: 16px;
  vertical-align: text-top;
  background-image: url('../../assets/img/close.png');
  background-position-y: 2px;
}
.add-icon {
  background-image: url('../../assets/img/add-icon.png');
  display: inline-block;
  width: 34px;
  height: 32px;
  flex-shrink: 0;
  cursor: pointer;
  border-left: 1px solid var(--tab-add-border-color);
  border-right: 1px solid var(--tab-add-border-color);
  background-size: 16px;
  background-position: 8px;
  flex-shrink: 0;
}
.quanping {
  position: absolute;
  width: 16px;
  height: 16px;
  right: 16px;
  top: 10px;
}
.contextMenu {
  position: fixed;
  padding: 4px 8px;
  text-align: left;
  list-style-type: none;
  background-color: #fff;
  background-clip: padding-box;
  border-radius: 2px;
  outline: none;
  box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
  z-index: 200;
  p {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #595959;
    line-height: 26px;
    cursor: pointer;
  }
}
.have-change {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 10px;
  position: relative;
  top: -2px;
  left: 7px;
  color: var(--has-change-color);
}
</style>
