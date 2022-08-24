<template>
  <div>
    <div ref="mainDom" class="tab-body" @mousemove="mainMove" @mouseup="mainUp">
      <div ref="topDom" :style="{ height: `${topHeight}px` }" class="tab-top">
        <div class="sql-head">
          <div class="head-left">
            <el-tooltip
              v-if="activeTabObj.taskStatus === 'wait'"
              class="box-item"
              effect="dark"
              content="立即执行"
              placement="bottom"
            >
              <span class="run head-icon" :class="{ 'dark-run': themes === 'dark' }" @mousedown.prevent="executeSql" />
            </el-tooltip>
            <el-tooltip
              v-if="activeTabObj.taskStatus === 'running'"
              class="box-item"
              effect="dark"
              content="暂停"
              placement="bottom"
            >
              <span class="pause head-icon" :class="{ 'dark-pause': themes === 'dark' }" @click="killTask" />
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="格式化" placement="bottom">
              <span class="formate head-icon" :class="{ 'dark-formate': themes === 'dark' }" @click="formateSql" />
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="保存" placement="bottom">
              <span class="save head-icon" :class="{ 'dark-save': themes === 'dark' }" @click="saveSql" />
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="异步执行" placement="bottom">
              <span class="async-run head-icon" :class="{ 'dark-async-run': themes === 'dark' }" @click="asyncRunSql" />
            </el-tooltip>
          </div>
          <div class="head-right">
            <el-tooltip class="box-item" effect="dark" content="上传文件" placement="bottom">
              <span class="file-add iconfont icon-shangchuan1" @click="uploadVisible = true"></span>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="帮助文档" placement="bottom">
              <span class="help-doc iconfont icon-bangzhu" @click="helpVisible = true"></span>
            </el-tooltip>

            <!-- <span style="padding-left: 16px" @click="setVisibale = true">更多配置</span> -->
          </div>
        </div>
        <div class="sql">
          <SqlEditor
            ref="sqlRef"
            :key="activeTabObj.id"
            :default-config="activeTabObj"
            :code="activeTabObj.content"
            :default-table="tables.value"
            :height="height"
            @sql-change="sqlChange"
            @run-sql="runSql"
            @keydown.f10.prevent="formateSql"
            @keydown.ctrl.s.prevent="saveSql"
          />
          <!-- {{ item.content }} -->
        </div>
      </div>
      <div ref="midDom" :class="{ 'tab-middle': !stateUp }" @mousedown="midMousedown">
        <div class="tab-middle-content"></div>
      </div>
      <div ref="bottomDom" :style="{ height: `${bottomHeight}px` }" class="tab-bottom">
        <fullscreen
          v-model="conScreenState.fullscreen"
          :teleport="conScreenState.teleport"
          :page-only="conScreenState.pageOnly"
          :exit-on-click-wrapper="false"
          fullscreen-class="fullscreen_class"
        >
          <div class="footer">
            <div class="foot-icon">
              <el-tooltip class="box-item" effect="dark" content="收起" placement="top">
                <span
                  v-show="!conScreenState.fullscreen && !stateUp"
                  class="zhankai"
                  :class="{ 'dark-zhankai': themes === 'dark' }"
                  @click="handleUp(true)"
                />
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="展开" placement="top">
                <span
                  v-show="!conScreenState.fullscreen && stateUp"
                  class="shouqi"
                  :class="{ 'dark-shouqi': themes === 'dark' }"
                  @click="handleUp(false)"
                />
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="conScreenState.fullscreen ? '退出全屏' : '全屏'"
                :placement="conScreenState.fullscreen ? 'bottom' : 'top'"
              >
                <span
                  v-show="!screenState && !conScreenState.fullscreen"
                  class="fangda"
                  :class="{ 'dark-fangda': themes === 'dark' }"
                  @click="conToggle"
                />
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="退出全屏" placement="bottom">
                <span
                  v-show="!screenState && conScreenState.fullscreen"
                  class="suoxiao"
                  :class="{ 'dark-suoxiao': themes === 'dark' }"
                  @click="conToggle"
                />
              </el-tooltip>
            </div>
            <div class="tab-box">
              <div class="tab-head-box">
                <el-scrollbar>
                  <div
                    v-for="item in bottomTabs"
                    :key="item.id"
                    :class="{ active: activeTabObj.activeTab === item.id }"
                    class="tab-head"
                    @click="tabChange(item.id)"
                  >
                    <span>
                      {{ item.title }}
                    </span>
                  </div>
                </el-scrollbar>
              </div>
              <div v-show="!stateUp || conScreenState.fullscreen" class="tab-body">
                <template v-if="showlog()">
                  <div ref="logBox" class="log-box" :style="{ maxHeight: bottomHeight - 32 + 'px' }">
                    <div v-for="i in activeTabObj.jobIds" :key="i.jobId">
                      <div v-if="i.sqlContent" class="log-title">
                        SQL内容：
                        <p :title="i.sqlContent">
                          {{ i.sqlContent.length > 100 ? `${i.sqlContent.substring(0, 100)}...` : i.sqlContent }}
                        </p>
                      </div>
                      <div class="log-content" @scroll="logScrollFn($event, i)">
                        <template v-for="(log, index) in i.logs">
                          <p
                            v-for="(l, ind) in log"
                            :key="index + ind"
                            :style="{ color: l.logLevel === 'INFO' ? 'auto' : 'red' }"
                            v-html="l.msgContent"
                          />
                        </template>
                      </div>
                    </div>
                  </div>
                </template>
                <keep-alive v-if="currentJob && currentJob.result">
                  <TaskResult
                    v-show="activeTabObj.activeTab !== 'third' && activeTabObj.activeTab !== 'first'"
                    :item="(currentJob && currentJob.result) || {}"
                    :height="bottomHeight - 35"
                    :sql-content="(currentJob && currentJob.sqlContent) || ''"
                    :actual-exe-sql="(currentJob && currentJob.actualExeSql) || ''"
                    :state-up="!stateUp || conScreenState.fullscreen"
                    :fullscreen="conScreenState.fullscreen"
                    :active-tab="activeTabObj.activeTab"
                    @update-result="updateResult($event, currentJob.jobId)"
                  />
                </keep-alive>

                <keep-alive>
                  <TaskHistory
                    v-show="activeTabObj.activeTab === 'third'"
                    :active-tab="activeTabObj.activeTab"
                    :fullscreen="conScreenState.fullscreen"
                    :height="bottomHeight - 35"
                    :state-up="!stateUp || conScreenState.fullscreen"
                    @runSql="historyRunSql"
                    @previwHanleUp="previwHanleUp"
                  />
                </keep-alive>
              </div>
            </div>
          </div>
        </fullscreen>
      </div>
    </div>
    <el-dialog v-model="saveVisibale" width="500px" title="保存查询">
      <el-form :v-model="activeTabObj" :label-width="100" :label-position="'right'">
        <el-form-item label="查询名称">
          <el-input v-model="activeTabObj.name" autocomplete="off" maxlength="128" />
        </el-form-item>
        <el-form-item label="保存路径">
          <el-select v-model="activeTabObj.groupName" :teleported="false" placeholder="请选择" style="width: 100%">
            <el-option v-for="i in config.groupList" :key="i.id" :label="i.groupName" :value="i.groupName" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button text bg @click="saveVisibale = false">取消</el-button>
          <el-button text bg type="primary" @click="saveSetting">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="asyncVisibale" width="500px" title="异步查询">
      <div class="async-tips">
        异步执行把SQL提交到后台执行，并把执行结果保存到文件中，可以从【运行历史】中下载执行结果。确定要提交异步查询吗？
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button text bg @click="asyncVisibale = false">取消</el-button>
          <el-button text bg type="primary" @click="asyncRunSetting">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="uploadVisible" destroy-on-close :width="500" title="创建临时表">
      <template #header="{ titleClass }">
        <div class="my-header">
          <div :class="{ [titleClass]: true, selected: uploadType === 0 }" @click="uploadType = 0">创建临时表</div>
          <div :class="{ [titleClass]: true, selected: uploadType === 1 }" @click="uploadType = 1">
            覆盖临时表<small style="font-size: 12px; color: #8c8c8c">(全表覆盖)</small>
          </div>
        </div>
      </template>
      <UploadModal :upload-type="uploadType" @close-dialog="uploadVisible = false" />
    </el-dialog>
    <el-dialog v-model="helpVisible" top="5vh" destroy-on-close title="帮助文档">
      <HelpModal />
      <template #footer>
        <span class="dialog-footer">
          <el-button text bg @click="helpVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { reactive, computed, onBeforeMount, ref, PropType, onMounted, onBeforeUnmount, watch } from 'vue'
import SqlEditor from './sqleditor.vue'
import TaskHistory from './task-history.vue'
import TaskResult from './tast-result.vue'
import HelpModal from './help.vue'
import UploadModal from './upload.vue'
import sqlFormatter from 'sql-formatter'
import { ElMessage } from 'element-plus'
import { component } from 'vue-fullscreen'
import store from '@/store'
import {
  queryGroupList,
  saveSqlApi,
  // queryEngine,
  // querydatasource,
  // queryDataCenter,
  batchExecute,
  realTimeLog,
  queryResult,
  cancelJob
} from '@/api/data-query'

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
    SqlEditor,
    fullscreen: component,
    TaskHistory,
    TaskResult,
    HelpModal,
    UploadModal
  },
  props: {
    data: {
      type: Array as PropType<DataArrayTypes[]>,
      default: () => []
      // require: true
    },
    treeData: {
      type: Array,
      default: () => []
    },
    active: {
      type: String,
      default: ''
    },
    screenState: {
      type: Boolean,
      default: false
    }
  },
  emits: ['updateForm', 'updateGroup', 'keydown'],
  setup(props: any, context: any) {
    const helpVisible = ref(false)
    const uploadVisible = ref(false)
    const uploadType = ref(0) // 0新增，1覆盖
    const bottomTabs = computed(() => {
      const defaultTabs = []
      const jobs = store.state.app.currentTab.jobIds
      if (jobs.length && (jobs.some((job: any) => job.logs) || store.state.app.currentTab.taskStatus === 'running')) {
        defaultTabs.unshift({ title: '运行日志', id: 'first' })
      }
      jobs.forEach((job: any, index: number) => {
        if (job.result) {
          defaultTabs.push({ title: `运行结果${index + 1}`, id: `${index + 1}` })
        }
      })
      defaultTabs.push({ title: '运行历史', id: 'third' })
      return defaultTabs
    })
    const activeTabObj = computed(() => {
      // console.log(store.state.app.currentTab, 'store.state.app.currentTab')
      return store.state.app.currentTab
    })
    const currentJob = computed(() => {
      return activeTabObj.value.jobIds[activeTabObj.value.activeTab - 1]
    })
    watch(
      () => store.state.app.currentTab,
      (newVal, oldVal) => {
        // 从历史中点击运行
        if (newVal.id !== oldVal.id && newVal.isHistoryRun) {
          store.dispatch('app/updateForm', { isHistoryRun: false, id: newVal.id })
          executeSql()
        }
      }
    )
    const tabs = computed(() => store.state.app.tabs)
    const qiankun_height = 83
    const defaultHeight = document.body.clientHeight - qiankun_height
    const startDrag = ref(false)
    const startY = ref()
    const logBox = ref()
    const topHeight = ref(defaultHeight - 35)
    const bottomHeight = ref(35)
    const height = ref(topHeight.value - 44) // sql编辑框高度
    const midMousedown = (e: any) => {
      if (!stateUp.value) {
        startDrag.value = true
        startY.value = e.clientY
      }
    }
    const mainMove = function (e: any) {
      if (startDrag.value) {
        const len = e.clientY - startY.value
        if (bottomHeight.value - len < 35 || topHeight.value + len <= 0) {
          startDrag.value = false
          // stateUp.value = true
          return
        }
        startY.value = e.clientY
        bottomHeight.value -= len
        topHeight.value += len
        height.value += len
      }
    }
    const mainUp = () => {
      startDrag.value = false
    }
    const themes = computed(() => store.state.app.themes)
    const FOOTHEIGHT = 300
    // const list = computed(() => props.data)
    const getTableTips = (arr: any) => {
      let table_arr: any = []
      const defaultValue: any = [
        'ck',
        'clickhouse',
        'hive',
        'mysql',
        'presto',
        'pst',
        'smart',
        'spark',
        'spk',
        'sr',
        'doris',
        'starrocks',
        'bjmd',
        'safelycc',
        'safe_lycc',
        'sfly',
        'dw_faster_doris',
        'rta_doris',
        'report_doris',
        'dp_data_db'
      ]
      const obj: any = {}
      for (let i = 0; i < arr.length; i++) {
        table_arr = table_arr.concat(arr[i].children)
      }
      table_arr.forEach((item: { name: string; children: never[] }) => {
        obj[item.name] = item.children.map((i: { name: any }) => i.name)
      })
      // for (let key of defaultValue) {
      //   let value = defaultValue[key]
      //   obj[value]= value
      // }
      for (const key of defaultValue) {
        obj[key] = { key: key }
      }
      return obj
    }
    const defaultTables = computed(() => getTableTips(props.treeData || []))
    const tables = reactive({
      value: defaultTables
    })
    const setVisibale = ref(false)
    const saveVisibale = ref(false)
    const asyncVisibale = ref(false)
    const sqlRef = ref<any | HTMLElement>(null) // tabs ref
    const stateUp = ref(true)

    const config: any = reactive({
      options: [],
      roomOptions: {},
      engine: [],
      dataSource: [],
      groupList: [],
      sqlLog: []
    })
    const conScreenState = reactive({
      fullscreen: false,
      teleport: true,
      pageOnly: false
    })
    const setTabels = (obj: any) => {
      for (const key in obj) {
        tables.value[key] = obj[key]
      }
    }
    const setObj = (arr = []) => {
      const obj: any = {}
      for (const key in arr) {
        obj[`${arr[key]}`] = []
      }
      return obj
    }
    const conToggle = () => {
      conScreenState.fullscreen = !conScreenState.fullscreen
    }
    // const getRoomOptions = async () => { // 查询机房
    //   const data = await getQueryTypeList({}) || []
    //   config.roomOptions = data
    // }
    // const getqueryEngine = async () => {
    //   // 查询引擎&数据源
    //   Promise.all([queryEngine({}), querydatasource({}), queryDataCenter([])]).then(
    //     ([engine, dataSource, roomOptions]) => {
    //       config.engine = engine
    //       config.dataSource = dataSource
    //       const opt: any = roomOptions
    //       config.roomOptions = Object.keys(opt).map((item) => ({ label: item, name: opt[item] }))
    //     }
    //   )
    // }
    const getGroupList = async (param: Object = {}) => {
      // 获取该用户的分组
      const data = await queryGroupList(param)
      config.groupList = data
    }
    onBeforeMount(() => {
      // getqueryEngine()
      getGroupList()
      // getRoomOptions
    })
    const setHeight = () => {
      const dHeight = document.body.clientHeight - qiankun_height - 44
      height.value = dHeight - bottomHeight.value
      topHeight.value = height.value + 44

      // const h = document.body.clientHeight - qiankun_height
      // height.value = status ? h - 44 : h - FOOTHEIGHT - 44
      // bottomHeight.value = status ? 35 : 300
      // // 已经是展开状态就不在减335
      // topHeight.value = status ? h - 35 : topHeight.value - (stateUp.value ? 300 - 35 : 0)
    }

    onMounted(() => {
      window.addEventListener('resize', setHeight)
      // @keydown.ctrl.enter.prevent="quickRunSql"
      window.addEventListener('keyup', quickRunSql)
      // document.onkeyup = quickRunSql
      if (activeTabObj.value.taskStatus === 'running') {
        runSql({ isSync: 1 })
      }
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', setHeight)
      // window.removeEventListener('keyup', quickRunSql)
      document.onkeyup = null
    })

    const handleSetting = () => {
      const obj = activeTabObj.value
      store.dispatch('app/updateForm', {
        dataSource: obj.dataSource,
        queryEngine: obj.queryEngine,
        dataCenter: obj.dataCenter,
        id: obj.id
      })
      setVisibale.value = false
    }
    const saveSetting = async () => {
      const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      const name = activeTabObj.value.name
      const groupName = activeTabObj.value.groupName
      if (!name || !groupName) {
        ElMessage({
          type: 'warning',
          message: '不能为空'
        })
        return
      }
      if (name.length > 128 || !reg.test(name)) {
        ElMessage({
          type: 'warning',
          message: '支持中文、英文、数字、下划线，不超过128个字符'
        })
        return
      }
      const obj = {
        id: activeTabObj.value.sqlId,
        content: activeTabObj.value.content,
        groupName,
        queryEngine: activeTabObj.value.queryEngine,
        dataSource: activeTabObj.value.dataSource,
        dataCenter: activeTabObj.value.dataCenter,
        name,
        tabId: activeTabObj.value.id
      }

      const res: any = await saveSqlApi(obj)
      ElMessage({
        message: '操作成功',
        type: 'success'
      })
      // context.emit('updateForm', {})
      context.emit('updateGroup')
      store.dispatch('app/updateForm', { sqlId: res.id, md5: res.content, id: res.tabId, name, groupName, title: name })
      saveVisibale.value = false
    }
    const sqlChange = (val: String) => {
      store.dispatch('app/updateForm', { content: val, id: activeTabObj.value.id })
    }
    const clearSqlInit = () => {
      activeTabObj.value.logTimer && clearTimeout(activeTabObj.value.logTimer)
      activeTabObj.value.jobIds = []
      store.dispatch('app/updateForm', { jobIds: [], id: activeTabObj.value.id })
    }
    const isNullStr = (str = '') => {
      return !str.replace(/[\r\n]/g, '').replace(/\ +/g, '')
    }
    const executeSql = () => {
      const selectSql = sqlRef.value!.cminstance && sqlRef.value!.cminstance.getSelection()
      const blurFlag = sqlRef.value!.blurFlag
      const cursorSql = sqlRef.value!.cursorSql
      const obj = activeTabObj.value
      if (selectSql) {
        // 如果有选中的sql 则执行选中的
        runSql({ isSync: 1, sqlContent: isNullStr(selectSql) ? obj.content : selectSql })
      } else {
        // 如果没有选中的sql
        if (blurFlag) {
          // 如果编辑器是去焦点，则执行所有的申请了
          runSql({ isSync: 1 })
        } else {
          // 执行当前焦点所在sql
          runSql({ isSync: 1, sqlContent: isNullStr(cursorSql) ? obj.content : cursorSql })
        }
      }
    }
    const quickRunSql = (e: any) => {
      if ((e.ctrlKey || e.shiftKey) && e.which === 13) {
        executeSql()
      }
    }
    const runSql = async (params: object) => {
      const obj = activeTabObj.value
      if (!obj.content) {
        ElMessage({
          message: 'sql内容为空，无法运行',
          type: 'warning'
        })
        return
      }
      clearSqlInit()
      const json = {
        // dataSource: obj.dataSource,
        dataSource: 'smart',
        sqlContent: obj.content,
        dataCenter: '',
        // dataCenter: obj.dataCenter,
        queryEngine: 'smart'
        // queryEngine: obj.queryEngine
      }
      const data: any = await batchExecute({ ...json, ...params, tabId: activeTabObj.value.id }).finally(() => {
        // killTask()
      })
      const resData = { data: data.sqlExecuteSubmitResultDomains || [], tabId: data.tabId }
      tabs.value.forEach((tab: any) => {
        if (tab.id === resData.tabId) {
          // 响应结果带回的tabId，去更新对应的tab数据
          // tab.jobIds = resData.data // tab上存储正在工作的id
          const ids = resData.data.map((i: { jobId: string }) => i.jobId)
          const logTimer = setTimeout(() => getLogs2(ids, tab), 1000)
          const status = resData.data.length > 0 ? 'running' : 'wait'
          store.dispatch('app/updateForm', {
            logTimer: logTimer,
            taskStatus: status,
            activeTab: 'first', // 日志
            jobIds: resData.data,
            id: resData.tabId
          })
        }
      })
      // jobIds.value = resData.data
      // const status = data.length > 0 ? 'running' : 'wait'
      // store.dispatch('app/updateForm', { activeTab: 'first', taskStatus: status, id: activeTabObj.value.id })
      // 直接显示日志tab
      // stateUp.value = true // 展开控制台
      // 没展开时，再打开
      stateUp.value && handleUp(false)
      // logTimer = setInterval(getLogs, 1000)
    }
    const queryResult2 = (params: object) => {
      queryResult({
        ...params
      }).then((res: any) => {
        setTabels(setObj(res.columnNameList))
        tabs.value.forEach((tab: any) => {
          tab.jobIds.forEach((job: any, index: number) => {
            if (job.jobId === res.jobId) {
              job.result = { ...res }
              store.dispatch('app/updateForm', { activeTab: `${index + 1}`, jobIds: tab.jobIds, id: tab.id })
            }
          })
        })
      })
    }

    const getLogs2 = async (jobIds: any, tab: any) => {
      tab.logTimer && clearTimeout(tab.logTimer)
      const logsData: any = (await realTimeLog({ jobIds: jobIds })) || []
      tabs.value.forEach((tab: any) => {
        let shouldUpdate = ''
        const scrollArr: any = []
        tab.jobIds.forEach((job: any, index: number) => {
          // 查看每个tab的jobIds里是否有jobid能匹配
          logsData.forEach((logs: any) => {
            if (logs.jobId === job.jobId) {
              shouldUpdate = job.jobId
              scrollArr.push(job.jobId)
              const itemContent =
                logs.sqlExecuteLogList &&
                logs.sqlExecuteLogList.map((i: { logLevel: any; msgContent: any }) => ({
                  logLevel: i.logLevel,
                  msgContent: i.msgContent
                }))
              job.logs = job.logs || []
              if (itemContent) {
                job.logs.push(itemContent)
              }
              const jobInfo = { ...job, ...logs }
              if (logs.isDone === 1 && logs.totalCount > 0) {
                // 去请求本次任务的执行结果
                queryResult2({
                  jobId: logs.jobId,
                  pageNo: 1,
                  pageSize: 100
                })
              } else if (logs.isDone === 1 && logs.totalCount === 0 && logs.execStatus === 'WAIT_AUDIT') {
                // 需要审批
                jobInfo.result = null
              } else if (logs.isDone === 1 && logs.totalCount === 0 && logs.execStatus !== 'WAIT_AUDIT') {
                // 更新本任务的执行结果
                jobInfo.result = {
                  resultData: [],
                  columnNameList: [],
                  content: tab.sqlContent
                }
              }
              tab.jobIds.splice(index, 1, jobInfo)
            }
          })
        })
        setTimeout(() => {
          scrollArr.forEach((shouldScrollId: any) => {
            activeTabObj.value.jobIds.forEach((job: any, j: number) => {
              if (job.jobId === shouldScrollId && !job.stopAutoScroll) {
                const logDoms = logBox.value && logBox.value.children[j] && logBox.value.children[j].children[1]
                if (logDoms) {
                  logDoms.scrollTop = logDoms.scrollHeight
                }
              }
            })
          })
        })
        if (shouldUpdate) {
          const ids = logsData.filter((i: any) => i.isDone !== 1)
          if (ids.length) {
            const idArr = ids.map((id: any) => id.jobId)
            const logTimer = setTimeout(() => getLogs2(idArr, tab), 1000)
            const activeTab = tab.activeTab || 'first'
            store.dispatch('app/updateForm', {
              activeTab,
              logTimer: logTimer,
              jobIds: tab.jobIds,
              id: tab.id
            })
          } else {
            const activeTab = tab.activeTab || 'first'
            store.dispatch('app/updateForm', { activeTab, taskStatus: 'wait', id: tab.id, jobIds: tab.jobIds })
          }
        } else {
          const activeTab = tab.activeTab || 'third'
          store.dispatch('app/updateForm', {
            activeTab: tab.activeTab || activeTab,
            taskStatus: 'wait',
            id: tab.id,
            jobIds: tab.jobIds
          })
        }
      })
    }
    const killTask = async () => {
      const ids = activeTabObj.value.jobIds.map((i: { jobId: string }) => i.jobId)
      activeTabObj.value.jobIds.forEach((job: any) => {
        job.logs = job.logs || []
        job.logs.push([
          {
            logLevel: 'ERROR',
            msgContent: '任务已停止'
          }
        ])
      })
      // activeTabObj.value.jobIds = []
      activeTabObj.value.logTimer && clearTimeout(activeTabObj.value.logTimer)
      store.dispatch('app/updateForm', {
        jobIds: activeTabObj.value.jobIds,
        taskStatus: 'wait',
        id: activeTabObj.value.id
      })
      // activeName.value = 'third'
      if (!ids.length) return
      await cancelJob({
        jobIds: ids
      })
      // context.emit('updateForm', { log: [], result: [] })
    }

    const updateResult = async (params: object, jobId: string) => {
      const json: any = await queryResult({ ...params, jobId })
      tabs.value.forEach((tab: any) => {
        tab.jobIds.forEach((job: any, index: number) => {
          if (job.jobId === json.jobId) {
            tab.jobIds.splice(index, 1, { ...job, result: json })
            store.dispatch('app/updateForm', { jobIds: tab.jobIds, id: tab.id })
          }
        })
      })
    }
    const asyncRunSql = () => {
      asyncVisibale.value = true
    }
    const asyncRunSetting = async () => {
      const obj = activeTabObj.value
      if (!obj.content) {
        return
      }
      const json = {
        // dataSource: obj.dataSource,
        dataSource: 'smart',
        sqlContent: obj.content,
        dataCenter: obj.dataCenter,
        queryEngine: 'smart',
        // queryEngine: obj.queryEngine,
        isSync: 0
      }
      await batchExecute(json)
      ElMessage({
        message: '已加入异步执行任务',
        type: 'success'
      })
      asyncVisibale.value = false
    }
    const saveSql = () => {
      if (!activeTabObj.value.content) {
        ElMessage({
          message: '请先写入SQL',
          type: 'warning'
        })
        return
      }
      if (!activeTabObj.value.sqlId) {
        saveVisibale.value = true
      } else {
        saveSetting()
      }
    }
    const formateSql = () => {
      activeTabObj.value.content = sqlFormatter.format(activeTabObj.value.content)
    }
    const previwHanleUp = () => {
      // 双击预览时，控制台没唤起的话，唤起控制台
      stateUp.value && handleUp(false)
    }
    const handleUp = (status: boolean) => {
      const h = document.body.clientHeight - qiankun_height
      height.value = status ? h - 84 : h - FOOTHEIGHT - 44
      bottomHeight.value = status ? 35 : 300
      // 已经是展开状态就不在减335
      topHeight.value = status ? h - 35 : topHeight.value - (stateUp.value ? 300 - 35 : 0)
      stateUp.value = status
    }

    const historyRunSql = (obj: any) => {
      if (tabs.value.length < 10) {
        // setTimeout(() => runSql({ isSync: 1 }), 100)  是否立即运行
        store.dispatch('app/addTabs', { ...obj })
      }
    }
    const tabChange = (name: string) => {
      store.dispatch('app/updateForm', { activeTab: name, id: activeTabObj.value.id })
      // if (name === 'first') {
      //   setTimeout(() => {
      //     if (logBox.value) {
      //       logBox.value.scrollTop = logBox.value.scrollHeight
      //     }
      //   })
      // }
    }
    const showlog = () => {
      return (
        activeTabObj.value.activeTab === 'first' &&
        activeTabObj.value.jobIds.length > 0 &&
        activeTabObj.value.jobIds.some((job: any) => job.logs && job.logs.length > 0)
      )
    }
    const logScrollFn = (e: any, d: any) => {
      let scrollStatus = false
      const scrollTop = e.target.scrollTop
      const windowHeitht = e.target.clientHeight
      const scrollHeight = e.target.scrollHeight
      const total = scrollTop + windowHeitht
      if (total === scrollHeight) {
        // 滚动到底部，开启自动滚动到底
        scrollStatus = false
      } else {
        // 用户手动操作滚动，停止自动滚动
        scrollStatus = true
      }
      const copyData = JSON.parse(JSON.stringify(activeTabObj.value.jobIds))
      for (let i = 0; i < copyData.length; i++) {
        if (copyData[i].jobId === d.jobId && copyData[i].stopAutoScroll !== scrollStatus) {
          copyData[i].stopAutoScroll = scrollStatus
          store.dispatch('app/updateForm', {
            jobIds: copyData,
            id: activeTabObj.value.id
          })
          break
        }
      }
    }
    return {
      // list,\
      showlog,
      tabChange,
      bottomHeight,
      topHeight,
      mainMove,
      mainUp,
      midMousedown,
      config,
      setVisibale,
      activeTabObj,
      saveVisibale,
      asyncVisibale,
      conScreenState,
      stateUp,
      height,
      tables,
      sqlRef,
      sqlChange,
      handleSetting,
      runSql,
      executeSql,
      asyncRunSql,
      saveSql,
      formateSql,
      saveSetting,
      asyncRunSetting,
      conToggle,
      handleUp,
      previwHanleUp,
      updateResult,
      killTask,
      historyRunSql,
      setTabels,
      setObj,
      quickRunSql,
      getGroupList,
      themes,
      bottomTabs,
      logBox,
      currentJob,
      helpVisible,
      uploadVisible,
      uploadType,
      logScrollFn
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-head-box :deep(.el-scrollbar__view) {
  display: flex;
}
.tab-body {
  background: var(--bg-color);
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
  flex-shrink: 0;
}
:deep(.el-tabs__nav-prev) {
  left: 5px;
}
:deep(.el-tabs__nav-next) {
  right: 5px;
}
.tab-middle {
  position: relative;
  height: 10px;
  margin-bottom: -10px;
  z-index: 1111;
  .tab-middle-content {
    display: none;
    height: 2px;
    background-color: var(--el-color-primary);
    position: absolute;
    width: 100%;
  }
}

.tab-middle:hover {
  cursor: ns-resize;
  .tab-middle-content {
    display: block;
  }
}
.tab-head-box {
  position: relative;
  border-bottom: 1px solid var(--tab-border-color);
  // border-left: 1px solid var(--tab-border-color);
  background: var(--bg-color);
  border-radius: 2px 2px 0px 0px;
  padding-right: 75px;
  user-select: none;
}

// .tab-head:last-child {
//   // border-right: none;
// }
.active {
  border-top: 2px solid #01b85c;
  color: #01b85c;
  background: var(--tab-active);
  border-radius: 2px 2px 0px 0px;
}
.selected {
  color: #01b85c;
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
}
.add-icon {
  padding: 8px;
  width: 15px;
  font-size: 16px;
  vertical-align: middle;
  padding-left: 16px;
  cursor: pointer;
  background-image: url('../../assets/img/add-icon.png');
  margin-left: 8px;
  vertical-align: -8px;
}
.quanping {
  position: absolute;
  width: 16px;
  height: 16px;
  right: 16px;
  top: 10px;
}

.sql-head {
  user-select: none;
  display: flex;
  height: 44px;
  padding: 12px 16px;
  background: var(--tab-active);
  // border-bottom: 1px solid var(--tab-border-color);
  border-left: 1px solid var(--tab-border-color);
  .head-left {
    flex: 1;
    .jiqi {
      width: 128px;
      height: 28px;
    }
    .head-icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background-repeat: no-repeat;
      background-size: contain;
      margin-right: 16px;
      vertical-align: middle;
      cursor: pointer;
    }
    .run {
      background-image: url('../../assets/img/run.png');
    }
    .dark-run {
      background-image: url('../../assets/img/icon_zizhu_zhixing@2x.png');
    }
    .run:hover {
      background-image: url('../../assets/img/run_hover.png');
    }
    .dark-run:hover {
      background-image: url('../../assets/img/icon_zizhu_zhixing_hover@2x.png');
    }
    // .pause:hover {
    //   // background-image: url('../../assets/img/pause_hover.png');
    // }
    .pause {
      background-image: url('../../assets/img/pause.png');
    }
    .dark-pause {
      background-image: url('../../assets/img/icon_pause@2x.png');
    }
    .dark-pause:hover {
      background-image: url('../../assets/img/icon_pause_hover@2x.png');
    }
    .async-run {
      background-image: url('../../assets/img/asyncrun.png');
    }
    .dark-async-run {
      background-image: url('../../assets/img/icon_zizhu_yibu@2x.png');
    }
    .async-run:hover {
      background-image: url('../../assets/img/asyncrun_hover.png');
    }
    .dark-async-run:hover {
      background-image: url('../../assets/img/icon_zizhu_yibu_hover@2x.png');
    }
    .save {
      background-image: url('../../assets/img/save.png');
    }
    .dark-save {
      background-image: url('../../assets/img/icon_zizhu_save@2x.png');
    }
    .save:hover {
      background-image: url('../../assets/img/save_hover.png');
    }
    .dark-save:hover {
      background-image: url('../../assets/img/icon_zizhu_save_hover@2x.png');
    }
    .formate {
      background-image: url('../../assets/img/formate.png');
    }
    .dark-formate {
      background-image: url('../../assets/img/icon_zizhu_geshihua@2x.png');
    }
    .formate:hover {
      background-image: url('../../assets/img/formate_hover.png');
    }
    .dark-formate:hover {
      background-image: url('../../assets/img/icon_zizhu_geshihua_hover@2x.png');
    }
  }
  .head-right {
    flex: 1;
    text-align: right;
    span {
      // font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      // line-height: 20px;
      // margin-top: 5px;
      display: inline-block;
      cursor: pointer;
      font-size: 18px;
      color: var(--tab-icon-color);
    }
    span:hover {
      color: var(--tab-icon-hover-color);
    }
  }
}
.file-add {
  margin-right: 18px;
}
.sql-head .head-right .help-doc {
  margin-right: 9px;
  float: right;
}
.sql {
  // padding: 12px 16px;
  padding-bottom: 0;
  background: var(--sql-footer-bg-color);
}
.footer {
  // margin-top: 12px;
  background: var(--sql-footer-bg-color);
  position: relative;
  :deep(.el-tabs__header) {
    max-width: calc(100% - 70px);
    margin: 0 0 0px;
    background: var(--sql-footer-bg-color);
  }
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  :deep(.el-tabs__nav-scroll) {
    background: var(--sql-footer-bg-color);
  }
  :deep(.el-tabs__active-bar) {
    display: none;
  }
  :deep(.el-tabs__item.is-active) {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #01b85c;
    line-height: 22px;
    background: var(--tab-active);
    border-top: 2px solid #01b85c;
  }
  :deep(.el-tabs__item) {
    padding: 6px 16px !important;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: var(--tab-color);
    line-height: 22px;
    // background: var(--bg-color);
    border-radius: 2px 2px 0px 0px;
    border-right: 1px solid var(--tab-active-border-color);
    height: auto;
  }
  :deep(.el-tabs__item:last-child) {
    border-right: none;
  }
  .foot-icon {
    position: absolute;
    top: 6px;
    right: 16px;
    z-index: 999;
    span {
      display: inline-block;
      width: 16px;
      height: 16px;
      background-repeat: no-repeat;
      background-size: contain;
      margin-left: 14px;
      vertical-align: middle;
      cursor: pointer;
    }
    .fangda {
      background-image: url('../../assets/img/icon_quanping.png');
    }
    .dark-fangda {
      background-image: url('../../assets/img/dark_quanping.png');
    }
    .suoxiao {
      background-image: url('../../assets/img/icon_suoxiao.png');
    }
    .dark-suoxiao {
      background-image: url('../../assets/img/dark_suoxiao.png');
    }
    .zhankai {
      background-image: url('../../assets/img/icon_shouqi.png');
      // border: 1px solid #ccc;
    }
    .dark-zhankai {
      background-image: url('../../assets/img/dark_shouqi.png');
    }
    .zhankai:hover {
      background-image: url('../../assets/img/icon_shouqi_hover.png');
    }
    .dark-zhankai:hover {
      background-image: url('../../assets/img/dark_shouqi.png');
    }
    .shouqi {
      background-image: url('../../assets/img/icon_zhankai.png');
    }
    .dark-shouqi {
      background-image: url('../../assets/img/dark_zhankai.png');
    }
    .shouqi:hover {
      background-image: url('../../assets/img/icon_zhankai_hover.png');
    }
    .dark-shouqi:hover {
      background-image: url('../../assets/img/dark_zhankai.png');
    }
  }
}
.log-box {
  padding: 16px 16px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--modal-tips-color);
  line-height: 20px;
  max-height: 300px;
  overflow: auto;
}
.results {
  .results-head {
    display: flex;
    justify-content: space-between;
    p:first-child {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #00b85c;
      line-height: 20px;
    }
    p:last-child {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 20px;
      i {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url('../../assets/img/down.png') no-repeat;
        background-size: 100% 100%;
        vertical-align: sub;
        margin-left: 8px;
      }
    }
  }
  .results-body {
    margin-top: 5px;
  }
}
.history {
  padding: 16px;
  .history-head {
    display: flex;
    justify-content: space-between;
    p:first-child {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 20px;
    }
    p:last-child {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 20px;
      span {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url('../../assets/img/refresh.png') no-repeat;
        background-size: 100% 100%;
        vertical-align: baseline;
        margin-left: 8px;
      }
    }
  }
}
.async-tips {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: var(--modal-tips-color);
  line-height: 22px;
}
.log-title {
  font-size: 14px;
  font-weight: bold;
  > p {
    display: inline-block;
  }
}
.log-content {
  padding: 4px 0;
  max-height: 300px;
  overflow: auto;
}
.sqltext {
  margin-left: 10px;
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.copy-text {
  margin-bottom: 12px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #00b85c;
  line-height: 20px;
}
.demo-tabs {
  :deep(.el-tabs__content) {
    background: var(--bg-color);
  }
}
.tab-bottom {
  border-left: 1px solid var(--tab-border-color);
}
.my-header {
  display: flex;
  div {
    margin-right: 20px;
    cursor: pointer;
  }
}
</style>
