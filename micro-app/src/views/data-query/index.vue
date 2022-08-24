<template>
  <div>
    <fullscreen
      v-model="screenState.fullscreen"
      :teleport="screenState.teleport"
      :page-only="screenState.pageOnly"
      :exit-on-click-wrapper="false"
      fullscreen-class="fullscreen_class"
    >
      <div class="query-container" @mousemove="mainMove" @mouseup="mainUp">
        <div
          v-show="sideFlag"
          ref="mapTree"
          class="left"
          :style="{
            maxHeight: isQiankun ? 'calc(100vh - 50px)' : 'calc(100vh - 35px)',
            minHeight: isQiankun ? 'calc(100vh - 50px)' : 'calc(100vh - 35px)',
            width: `${leftWidth}px`
          }"
        >
          <div class="tab">
            <p
              v-for="(item, index) in leftTab"
              :key="index + 1"
              :class="{ active: num == index }"
              @click="leftTabClick(index)"
            >
              {{ item }}
            </p>
            <I
              v-show="num === 0"
              class="refresh-icon"
              name="RefreshLeft"
              @click="getBusinessTableList(filterTableText)"
            />
            <I v-show="num === 1" class="refresh-icon" name="RefreshLeft" @click="getTableList(filterTableText1)" />
            <I
              v-show="num === 2"
              class="refresh-icon"
              style="transform: rotate(45deg)"
              name="Close"
              @click="dialogFormVisible = true"
            />
          </div>
          <div v-show="num == 0" class="table-pane">
            <p class="search-box">
              <el-input
                v-model="filterTableText"
                class="search"
                :suffix-icon="Search"
                placeholder="请输入表名进行搜索"
                clearable
              />
            </p>
            <template v-if="businessTreeData.length > 0">
              <el-tree
                ref="businessTreeRef"
                class="business-tree"
                style="margin-top: 8px"
                :indent="4"
                :load="loadBusinessTreeData"
                lazy
                :props="defaultProps"
                :filter-node-method="filterNode"
              >
                <template #default="slotProps">
                  <p class="tree-msg" @dblclick="!slotProps.data.children ? addSql(slotProps.data) : null">
                    <span v-if="!slotProps.data.children" class="icon icon2" style="margin-left: 0"></span>
                    <span v-if="slotProps.data.children" class="msg" :class="{ blodMsg: slotProps.data.layer === 0 }">{{
                      `${slotProps.data.name}${slotProps.data.num ? `(${slotProps.data.num})` : ''}`
                    }}</span>
                    <I
                      v-if="slotProps.data.children && slotProps.data.layer === 0"
                      name="ArrowDown"
                      :class="{ expanded: slotProps.node.expanded }"
                    />
                    <span v-if="!slotProps.data.children" class="msg">{{
                      `${slotProps.data.db}.${slotProps.data.name}`
                    }}</span>
                    <el-tooltip v-if="!slotProps.data.children" effect="dark" content="点击查看表详情" placement="top">
                      <I
                        name="Document"
                        :size="14"
                        class="tips"
                        @click="showTips(slotProps.data, slotProps.data.name)"
                      />
                    </el-tooltip>
                  </p>
                </template>
              </el-tree>
            </template>
            <EmptyTree v-if="businessTreeData.length === 0" :loading="businessLoading">暂无HIVE类型的表数据</EmptyTree>
          </div>
          <div v-show="num == 1" class="table-pane">
            <p class="search-box">
              <el-input
                v-model="filterTableText1"
                class="search"
                :suffix-icon="Search"
                placeholder="请输入表名进行搜索"
                clearable
              />
            </p>
            <template v-if="treeData.length > 0">
              <el-tree
                ref="tableTreeRef"
                style="margin-top: 8px"
                :indent="4"
                :load="loadTreeData"
                lazy
                :props="defaultProps"
                :filter-node-method="filterNode"
              >
                <template #default="slotProps">
                  <p class="tree-msg" @dblclick="slotProps.data.layer === 2 ? addSql(slotProps.data) : null">
                    <span
                      v-if="slotProps.data.layer === 0"
                      class="icon"
                      :class="slotProps.data.name.split('_')[0].toLowerCase()"
                    ></span>
                    <span v-if="slotProps.data.layer === 1" class="icon icon1"></span>
                    <span v-if="slotProps.data.layer === 2" class="icon icon2"></span>
                    <span class="msg">{{ slotProps.data.name }}</span>
                    <el-tooltip
                      v-if="slotProps.data.layer === 2"
                      effect="dark"
                      content="点击查看表详情"
                      placement="top"
                    >
                      <I
                        name="Document"
                        :size="14"
                        class="tips"
                        @click="showTips(slotProps.data, slotProps.data.name)"
                      />
                    </el-tooltip>
                  </p>
                </template>
              </el-tree>
            </template>
            <EmptyTree v-if="treeData.length == 0" :loading="tableLoading" />
          </div>
          <div v-show="num == 2" class="table-pane">
            <p class="search-box">
              <el-input
                v-model="filterTableText2"
                class="search"
                :suffix-icon="Search"
                clearable
                placeholder="请输入表名进行搜索"
              />
            </p>
            <el-tree
              ref="searchTreeRef"
              style="margin-top: 8px"
              :indent="8"
              :data="searchTree.data"
              :props="defaultGroupProps"
              :filter-node-method="filterNode"
            >
              <template #default="slotProps">
                <Title
                  :name="slotProps.node.level === 1 ? slotProps.data.groupName : slotProps.data.name"
                  :show-dele="!(slotProps.data.groupName === 'default' && slotProps.node.level === 1)"
                  :show-eidt="slotProps.data.groupName !== 'default' && slotProps.node.level === 1"
                  @edit-fold="editFold($event, slotProps.data.id)"
                  @del-fold="delFold(slotProps.node.level === 1, slotProps.data.id)"
                  @dblclick="dbAddSql(slotProps.data)"
                >
                  <img
                    v-if="slotProps.node.level === 1"
                    class="flod-icon"
                    src="../../assets/img/icon_folder.png"
                    alt=""
                  />
                </Title>
              </template>
            </el-tree>
          </div>
        </div>
        <div v-show="sideFlag" class="map_drag_line pull" @mousedown="midMousedown">
          <div class="drag-content"></div>
        </div>
        <div class="right" :style="{ width: `${rightWidth}px` }">
          <span
            class="side side-up"
            :class="{
              zhankai: !sideFlag,
              'dark-side': themes === 'dark',
              'dark-zhankai': !sideFlag && themes === 'dark'
            }"
            @click="sideUp"
          />
          <div class="spl-container">
            <Tabs
              ref="tabsRef"
              :screen-state="screenState"
              :data="sqlConfig"
              :tree-data="treeData"
              :active="activeItem"
              @toggle="toggle"
              @add-tab="addTab"
              @remove-tab="removeTab"
              @select-tab="selectTab"
              @updateGroup="getGroupList"
            />
          </div>
        </div>
      </div>
    </fullscreen>
    <el-dialog v-model="dialogTableVisible" destroy-on-close :title="ddlParams.name">
      <DetailModal :ddl-params="ddlParams.value" />
      <template #footer>
        <span class="dialog-footer">
          <el-button text bg @click="dialogTableVisible = false">取消</el-button>
          <el-button text bg type="primary" @click="dialogTableVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogFormVisible" width="500px" title="新建文件夹">
      <el-form :model="form" @submit.prevent="null">
        <el-form-item label="文件夹名称" :rules="{ required: true, message: '不能为空', trigger: 'blur' }" prop="name">
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="支持中文、英文、数字、下划线，不超过128个字符"
            maxlength="128"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button text bg @click="dialogFormVisible = false">取消</el-button>
          <el-button text bg type="primary" @click="addFold">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="delFoldVisible.value" width="420px" title="提示">
      <div>是否确认将其删除?</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button text bg @click="delFoldVisible.value = false">取消</el-button>
          <el-button text bg type="primary" @click="delFoldConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElTree } from 'element-plus'
import { component as fullscreen } from 'vue-fullscreen'
import { Search } from '@element-plus/icons-vue'
import store from '@/store'
import Tabs from './tabs.vue'
import DetailModal from './table-detail.vue'
import Title from './tree-title.vue'
import EmptyTree from './empty-tree.vue'
import {
  gethiveTableMetaData,
  quertSqlList,
  groupSave,
  deleteGroup,
  deleteSql,
  previewHiveData
} from '@/api/data-query'

const screenState = reactive({
  fullscreen: false,
  teleport: true,
  pageOnly: false
})
const toggle = () => {
  screenState.fullscreen = !screenState.fullscreen
  if (screenState.fullscreen) {
    sideFlag.value = false
  }
}
const themes = computed(() => store.state.app.themes)
// const defaultConfig = computed(() => store.state.app.defaultConfig)
// const defaultConfig = {
//   content: '', // sql的内容
//   queryType: 'Hive',
//   logTimer: null,
//   md5: undefined,
//   dataSource: 'Hive', // 数据源
//   dataCenter: 'BJMD', // 机房
//   queryEngine: 'Hive', // 查询引擎
//   activeTab: 'third', // 默认选中运行历史
//   taskStatus: 'wait', //  'wait' | 'running'
//   result: [], // 运行结果
//   history: [], // 运行历史
//   log: [] // 运行日志
// }
const filterTableText = ref('')
const filterTableText1 = ref('')
const filterTableText2 = ref('')
const num = ref(0)
// const tabIndex = 1
const MAXTABLENGTH = 20
// const editableTabsValue = ref('2')
// const defalutId = uuid.v1() // 默认显示一个sql编辑框 id
const businessTreeData: any = ref([])
const treeData: any = ref([]) // 表数据
const dialogTableVisible = ref(false) // 查看详情弹窗
const dialogFormVisible = ref(false) // 添加文件夹弹窗
const sideFlag = ref(true) // 默认展开
const mapTree = ref<any | HTMLElement>(null)
const tabsRef = ref<any | HTMLElement>(null) // tabs ref
const isQiankun = ref((window as any).__POWERED_BY_QIANKUN__)
const sqlConfig = computed(() => store.state.app.tabs)
// const sqlConfig = reactive({
//   // sql 编辑框数据
//   data: [
//     {
//       title: 'New1',
//       id: defalutId, // 唯一id
//       sqlId: undefined,
//       ...defaultConfig
//     }
//   ]
// })
const searchTree: any = reactive({
  // 我的查询
  data: []
})
const form = reactive({
  // 添加文件夹表单内容
  name: ''
})

const ddlParams = reactive({
  // 我的查询
  value: [],
  name: ''
})
const delFoldVisible = reactive({
  value: false,
  isFold: false,
  id: ''
})
const activeItem = computed(() => store.state.app.currentTab.id)

const defaultProps = {
  children: 'children',
  label: 'name',
  isLeaf: 'leaf'
}
const defaultGroupProps = {
  children: 'rowList',
  label: 'groupName'
}
const leftTab = ['按业务', '按存储', '我的查询']

const leftTabClick = (index: any) => {
  num.value = index
}

const sideUp = () => {
  sideFlag.value = !sideFlag.value
}

const startDrag = ref(false)
const startX = ref()
const leftWidth = ref(310)
const rightWidth = ref()
const clientWidth = document.body.clientWidth
const midMousedown = (e: any) => {
  startDrag.value = true
  startX.value = e.clientX
}
const mainMove = function (e: any) {
  if (startDrag.value) {
    const len = e.clientX - startX.value
    if (leftWidth.value + len < 200) {
      startDrag.value = false
      leftWidth.value = 200
      rightWidth.value = clientWidth - leftWidth.value - 2
      return
    }
    if (leftWidth.value + len > 500) {
      startDrag.value = false
      leftWidth.value = 500
      rightWidth.value = clientWidth - leftWidth.value - 2
      return
    }
    startX.value = e.clientX
    leftWidth.value += len
    rightWidth.value = clientWidth - leftWidth.value - 2
  }
}
const mainUp = () => {
  startDrag.value = false
  store.dispatch('app/setLeftWidth', leftWidth.value)
}
onMounted(() => {
  getBusinessTableList('')
})
const businessLoading = ref(false)
const getBusinessTableList = async (keyword: string) => {
  businessTreeData.value = []
  businessLoading.value = true
  const data = await gethiveTableMetaData({ keyword, queryType: 'biz' })
  businessTreeData.value = data || []
  businessLoading.value = false
}
const loadBusinessTreeData = (node: any, resolve: (data: any) => void) => {
  // “按业务”树形组件懒加载
  if (node.level === 0) {
    return resolve(businessTreeData.value.map((item: any) => ({ ...item, leaf: !item.num })))
  } else {
    return resolve(node.data.children.map((item: any) => ({ ...item, leaf: !item.num })))
  }
}
const tableLoading = ref(false)
const getTableList = async (keyword: string) => {
  treeData.value = []
  tableLoading.value = true
  const data = await gethiveTableMetaData({ keyword })
  treeData.value = data || []
  tableLoading.value = false
}
const loadTreeData = (node: any, resolve: (data: any) => void) => {
  // “按存储”树形组件懒加载
  if (node.level === 0) {
    return resolve(treeData.value.map((item: any) => ({ ...item, leaf: !item.children || !item.children.length })))
  } else {
    return resolve(node.data.children.map((item: any) => ({ ...item, leaf: !item.children || !item.children.length })))
  }
}
const getGroupList = async () => {
  const data = await quertSqlList({ keyWord: '' })
  searchTree.data = data
}
const addSql = async (data: any) => {
  const source = data.ds ? data.ds.toLowerCase() : ''
  const center = data.dc ? data.dc.toLowerCase() : ''
  const code = `--${source === 'hive' ? 'smart' : source} ${
    ['hive', 'doris'].includes(source) ? center : ''
  }\nselect * from ${data.db}.${data.name} limit 10;`
  // previewHiveData
  addTab({
    content: code,
    sqlId: data.id,
    dataSource: 'smart',
    // dataSource: data.ds,
    dataCenter: data.dc,
    queryEngine: 'smart'
    // queryEngine: data.queryEngine || (data.dataSource === 'Hive' ? 'Hive' : undefined)
  })
  if (sqlConfig.value.length >= MAXTABLENGTH) {
    return
  }
  const json: any = await previewHiveData({
    table: data.name,
    database: data.db,
    dataCenter: data.dc,
    sqlContent: code,
    dataSource: data.ds
  })

  const obj = tabsRef.value.setObj(json.columnNameList)
  tabsRef.value.setTabels(obj)
  tabsRef.value.consoleUp()

  store.dispatch('app/updateForm', {
    activeTab: '1',
    jobIds: [
      {
        sqlContent: `select * from ${data.db}.${data.name} limit 10;`,
        result: {
          ...json,
          content: code
        }
      }
    ],
    id: activeItem.value
  })
}

const dbAddSql = (obj: any) => {
  const { id, name, content, dataCenter, dataSource, queryEngine, groupName } = obj
  if (id && name) {
    addTab({
      content: content,
      dataCenter,
      sqlId: id,
      name,
      queryEngine,
      dataSource,
      groupName
    })
  }
}
const showTips = (data: any, name: any) => {
  ddlParams.value = data
  ddlParams.name = name
  dialogTableVisible.value = true
}

const addTab = (obj: Object = {}) => {
  if (sqlConfig.value.length >= MAXTABLENGTH) {
    ElMessage({
      type: 'warning',
      message: '最多新开20个Tab'
    })
    return
  }

  store.dispatch('app/addTabs', { ...obj })
}

const removeTab = (id: string) => {
  if (sqlConfig.value.length === 1) {
    return
  }
  store.dispatch('app/removeTab', id)
}

const selectTab = (id: String) => {
  store.dispatch('app/selectTab', id)
  // activeItem.value = id
}

const editFold = async (v: any, id: any) => {
  try {
    await groupSave({
      id,
      groupName: v
    })
    getGroupList() // 刷新下列表
    tabsRef.value.getGroupList() // 刷新下文件夹列表
  } catch (e) {
    console.log(e)
  }
}

const addFold = async () => {
  const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
  if (form.name.length > 128 || !reg.test(form.name)) {
    ElMessage({
      type: 'warning',
      message: '支持中文、英文、数字、下划线，不超过128个字符'
    })
    return
  }
  editFold(form.name, undefined)
  form.name = ''
  dialogFormVisible.value = false
}

const delFoldConfirm = async () => {
  // 判断一下是删除的文件夹还是查询
  if (delFoldVisible.isFold) {
    await deleteGroup({ id: delFoldVisible.id })
  } else {
    await deleteSql({ id: delFoldVisible.id })
  }
  ElMessage({
    type: 'success',
    message: '删除成功'
  })
  delFoldVisible.value = false
  getGroupList()
}

const delFold = (isFold: boolean, id: any) => {
  delFoldVisible.value = true
  delFoldVisible.isFold = isFold
  delFoldVisible.id = id
}

const businessTreeRef = ref<InstanceType<typeof ElTree>>()
const tableTreeRef = ref<InstanceType<typeof ElTree>>()
const searchTreeRef = ref<InstanceType<typeof ElTree>>()

watch(filterTableText, (val) => {
  businessTreeRef.value && businessTreeRef.value!.filter(val)
})
watch(filterTableText1, (val) => {
  tableTreeRef.value && tableTreeRef.value!.filter(val)
})
watch(filterTableText2, (val) => {
  searchTreeRef.value && searchTreeRef.value!.filter(val)
})

watch(num, (val) => {
  if (val === 1 && treeData.value.length === 0) {
    getTableList('')
  }
  if (val === 2 && searchTree.data.length === 0) {
    getGroupList()
  }
})

const filterNode = (value: string, data: any) => {
  if (!value || !data) return true
  const name = data.name || data.groupName
  return name && name.toLowerCase().includes(value.toLowerCase())
}
</script>

<style lang="scss" scoped>
.query-container {
  display: flex;
  overflow: hidden;
  // height: 100%;
  background: var(--sql-bg-color);
  // .map_drag_line {
  //   width: 2px;
  //   background-color: var(--drag-line-color);
  //   position: relative;
  //   height: calc(100vh - 50px);
  //   top: 0;
  //   &:hover {
  //     background-color: var(--el-color-primary);
  //     cursor: ew-resize;
  //   }
  // }
  .map_drag_line {
    position: relative;
    width: 20px;
    margin-right: -10px;
    margin-left: -10px;
    z-index: 1111;
    .drag-content {
      display: none;
      width: 2px;
      background-color: var(--el-color-primary);
      position: absolute;
      height: 100%;
      margin-left: 7px;
    }
  }

  .map_drag_line:hover {
    cursor: ew-resize;
    .drag-content {
      display: block;
    }
  }
  .left {
    position: relative;
    opacity: 1;
    // box-shadow: 0px 1px 0px 0px #ecf0f3;
    width: 310px;
    // margin-right: 8px;
    background: var(--bg-color);
    border-radius: 2px;
    // padding: 8px;
    // height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    // -webkit-transition: width 0.2s;
    // transition: width 0.2s;
    // height: calc(100vh - 52px);
    // min-height: calc(100% - 92px);
    // max-height: calc(100vh - 92px);
    .tab {
      background: var(--bg-color);
      box-shadow: inset 0px -1px 0px 0px var(--tab-box-shadow-color);
      display: flex;
      align-items: center;
      p {
        display: inline-block;
        // width: 50%;
        padding: 11px 16px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        // color: #262626;
        color: var(--tab-color);
        line-height: 20px;
        text-align: center;
        cursor: pointer;
      }
      .active {
        border-bottom: 2px solid #00b85c;
        color: #00b85c;
        background: var(--bg-color);
      }
    }
    .table-pane {
      padding-top: 8px;
    }
    .search-box {
      padding: 0 12px;
    }
    .search {
      width: 100%;
      height: 28px;
      font-size: 12px;
    }
    .refresh-icon {
      cursor: pointer;
      float: right;
      // margin-top: 18px;
      // margin-right: 15px;
      color: #a6a6a6;
      margin-left: auto;
      margin-right: 16px;
    }
    .flod-icon {
      width: 16px;
      height: 16px;
      margin-top: 3px;
      margin-right: 6px;
    }
    :deep(.el-tree-node__content) {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: var(--tree-title-color);
      line-height: 20px;
      .el-tree-node__expand-icon {
        display: none;
        padding: 0px;
        padding-right: 2px;
      }
    }
    :deep(.tree-msg) {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #595959;
      line-height: 20px;
      width: 100%;
      display: flex;
      padding: 0 12px;
      justify-content: space-between;
      &:hover {
        .tips {
          visibility: visible;
        }
      }
      .msg {
        display: inline-block;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    :deep(.icon) {
      display: inline-block;
      width: 16px;
      height: 16px;
      background-size: contain;
      // margin-left: 8px;
    }
    :deep(.tips) {
      visibility: hidden;
      display: inline-block;
      // width: 12px;
      // height: 12px;
      // background: url('../../assets/img/zn_icon_tip.png') no-repeat;
      // background-size: contain;
      margin-top: 2px;
      z-index: 2;
      color: #01b85c;
    }
    :deep(.tips:hover) {
      // background: url('../../assets/img/icon_xiangqing_hover@2x.png') no-repeat;
      // background-size: contain;
      color: #01b85c;
    }
    :deep(.icon1) {
      margin-top: 4px;
      margin-left: 10px;
      width: 16px;
      height: 16px;
      background-image: url('../../assets/img/shujuku.png');
    }
    :deep(.icon2) {
      margin-top: 4px;
      margin-left: 20px;
      width: 16px;
      height: 16px;
      background-image: url('../../assets/img/table3.png');
    }
    :deep(.hive) {
      width: 16px;
      height: 16px;
      background-image: url('../../assets/img/hive.png');
    }
    :deep(.clickhouse) {
      width: 16px;
      height: 16px;
      background-image: url('../../assets/img/clickhouse.png');
    }
    :deep(.doris) {
      width: 16px;
      height: 16px;
      background-image: url('../../assets/img/Doris.png');
    }
    :deep(.mysql) {
      width: 16px;
      height: 16px;
      background-image: url('../../assets/img/mysql.png');
    }
    :deep(.starrocks) {
      width: 16px;
      height: 16px;
      background-image: url('../../assets/img/star.png');
    }
    :deep(.msg) {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: var(--tree-title-color);
      display: inline-block;
      vertical-align: 3px;
      padding-left: 6px;
      text-align: left;
      flex: 1;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      user-select: none;
    }
    .blodMsg {
      font-weight: 600;
      padding-left: 12px;
    }
  }
  .right {
    position: relative;
    width: calc(100% - 320px);
    height: calc(100vh - 50px);
    box-sizing: content-box;
    flex: 1;
    // background: #fff;
    padding-top: 0;
    padding-left: 0;
    background: var(--bg-color);
  }
  .side {
    position: absolute;
    display: none;
    width: 16px;
    height: 68px;
    background: url('../../assets/img/zhankai.png') no-repeat;
    background-size: contain;
    cursor: pointer;
    z-index: 3;
  }
  .dark-side {
    background: url('../../assets/img/dark-up.png') no-repeat;
    background-size: contain;
    transform: rotate(0deg) !important;
  }
  .side-up {
    top: 50%;
    left: -18px;
    transform: rotate(180deg);
  }
  .zhankai {
    display: inline-block;
    // background: url('../../assets/img/icon-zhankai.png') no-repeat;
    transform: rotate(0deg);
    left: 0px;
    background-size: contain;
  }
  .dark-zhankai {
    display: inline-block;
    background: url('../../assets/img/dark-zhankai.png') no-repeat;
    background-size: contain;
  }
}
.query-container .left {
  .business-tree .tree-msg {
    padding-left: 0;
  }
  .business-tree :deep(.el-tree-node__children .el-tree-node__expand-icon) {
    display: inline-flex;
    padding-right: 0;
    margin-left: 11px;
  }
}
// .left:hover + .map_drag_line {
//   background-color: red;
// }
.left:hover + .map_drag_line + .right {
  .side {
    display: inline-block;
  }
}
.side:hover {
  display: inline-block;
}
:deep(.el-table td.el-table__cell div) {
  font-size: 12px;
}
:deep(.el-table th.el-table__cell > .cell) {
  font-size: 12px;
}
.expanded {
  transform: rotate(180deg);
}
</style>
