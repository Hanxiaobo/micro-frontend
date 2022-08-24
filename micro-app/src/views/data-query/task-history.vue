<template>
  <div>
    <div
      v-show="props.stateUp"
      class="history"
      :style="{ maxHeight: props.fullscreen ? 'calc(100vh - 51px)' : height + 'px' }"
    >
      <div class="history-head">
        <p>只可下载最近7天查询的文件，每个文件最多支持2w行数据</p>
        <p>
          <el-checkbox v-model="asyncFlag" style="font-size: 12px" label="只展示异步执行" size="large" />
          <span
            style="cursor: pointer"
            @click="queryLogList({ pageSize: 100, page: 1, isSync: asyncFlag ? 0 : undefined })"
          ></span>
        </p>
      </div>
      <div class="results-body">
        <el-table
          ref="resTable"
          :height="props.fullscreen ? fullHeight() : tableHeight()"
          :data="scrollData"
          border
          :row-style="{ height: '33px' }"
        >
          <el-table-column property="execStartTime" show-overflow-tooltip :width="cWidth[0]" label="运行时间">
            <template #default="{ row }">
              {{ DateFormat(row.execStartTime) }}
            </template>
          </el-table-column>
          <el-table-column min-width="170px" property="sqlContent" label="查询SQL（双击复制）" show-overflow-tooltip>
            <template #default="scope">
              <span class="sqltext" @click="viewSql(scope.row.sqlContent)">{{ scope.row.sqlContent }}</span>
            </template>
          </el-table-column>
          <el-table-column property="dataSource" show-overflow-tooltip :width="cWidth[2]" label="数据源类型" />
          <el-table-column property="dataCenter" :width="cWidth[3]" show-overflow-tooltip label="集群">
            <template #default="{ row }">
              {{ row.dataCenter || '-' }}
            </template>
          </el-table-column>
          <el-table-column property="isSync" show-overflow-tooltip label="执行方式" :width="cWidth[4]">
            <template #default="{ row }">
              {{ row.isSync === 1 ? '同步' : '异步' }}
            </template>
          </el-table-column>
          <el-table-column property="execStatus" show-overflow-tooltip label="运行结果" :width="cWidth[5]">
            <template #default="{ row }">
              <span class="execStatus" :class="`color${row.execStatus}`"></span>
              {{ statusText[row.execStatus] }}
            </template>
          </el-table-column>
          <el-table-column property="executeCostTime" show-overflow-tooltip label="耗时" :width="cWidth[6]">
            <template #default="{ row }"> {{ row.executeCostTime }}ms </template>
          </el-table-column>
          <el-table-column property="totalCount" show-overflow-tooltip label="返回结果" :width="cWidth[7]">
            <template #default="{ row }"> {{ row.totalCount }} 条 </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="{ row }">
              <el-opt-buttons>
                <template v-if="row.execStatus === 2 && row.sqlType !== 'CREATE'" #btn1>
                  <el-button type="success" size="small" text>
                    <span class="download" style="font-size: 12px" @click="currentViewFn(row)">查看</span>
                  </el-button>
                </template>
                <template v-if="[2, 3].indexOf(row.execStatus) > -1" #btn2>
                  <el-button
                    type="success"
                    size="small"
                    text
                    class="download"
                    @click="searchLog(row.jobId)"
                  >日志</el-button>
                </template>
                <template
                  v-if="[2].indexOf(row.execStatus) > -1 && row.totalCount > 0 && row.sqlType !== 'CREATE'"
                  #btn3
                >
                  <el-button
                    style="background-color: unset"
                    :loading="loadingButtons.includes(row.jobId)"
                    type="success"
                    size="small"
                    text
                  >
                    <!-- <span class="download" style="font-size: 12px" @click="openNew(`${row.jobId}`)">{{
                      loadingButtons.includes(row.jobId) ? '' : '下载'
                    }}</span> -->
                    <span
                      class="download"
                      style="font-size: 12px; color: #01b85c"
                      @click="downloadFn(`${row.jobId}`)"
                    >下载</span>
                  </el-button>
                </template>
                <template v-if="[2].indexOf(row.execStatus) > -1 && row.sqlType !== 'CREATE'" #btn4>
                  <el-button
                    style="background-color: unset; font-size: 12px; color: #01b85c"
                    type="success"
                    text
                    class="download"
                    size="small"
                    @click="runClick(row)"
                  >运行</el-button>
                </template>
              </el-opt-buttons>
            </template>
          </el-table-column>
        </el-table>
        <div class="fact-pagination-context">
          <el-pagination
            :current-page="pageSetting.page"
            class="fact-pagination"
            small
            :page-size="pageSetting.pageSize"
            :background="true"
            layout="total, slot, prev, pager, next, jumper"
            :total="config.total"
            @current-change="handleCurrentChange"
          >
            <el-select v-model="pageSetting.pageSize" :teleported="false" @change="handleSizeChange">
              <el-option v-for="item in pageSizeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-pagination>
        </div>
      </div>
    </div>
    <div
      v-if="viewStatus"
      class="view-result"
      :style="{ maxHeight: props.fullscreen ? 'calc(100vh - 51px)' : height + 'px' }"
    >
      <!-- <button @click="viewStatus = false">返回</button> -->
      <TaskResult
        :item="viewRes"
        :height="height"
        :sql-content="currentView.sqlContent"
        :state-up="!stateUp || props.fullscreen"
        :fullscreen="props.fullscreen"
        :active-tab="''"
        @update-result="viewResult({ ...$event, jobId: currentView.jobId })"
      >
        <div>
          <el-tooltip class="box-item" effect="dark" content="图表制作" placement="bottom">
            <I class="dashboard" name="PieChart" @click="goRawgraphs"></I>
          </el-tooltip>
          <span class="back-btn" @click="viewStatus = false">返回</span>
        </div>
      </TaskResult>
    </div>
    <el-dialog v-model="sqlVisibale.visibale" width="500px" title="查看SQL">
      <div>
        <p class="copy-text" @click="copySql(sqlVisibale.sql)">一键复制</p>
        <code>
          {{ sqlVisibale.sql }}
        </code>
      </div>
      <template #footer>
        <span>
          <el-button text bg @click="sqlVisibale.visibale = false">取消</el-button>
          <el-button text bg type="primary" @click="sqlConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="logVisibale" width="500px" title="查看日志">
      <div class="log-box" style="padding: 0; max-height: 300px; overflow: auto">
        <p
          v-for="(l, index) in config.sqlLog"
          :key="index"
          :style="{ color: l.logLevel === 'ERROR' ? 'red' : '' }"
          v-html="l.msgContent"
        />
        <p v-if="config.sqlLog.length === 0">暂无日志</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button text bg @click="logVisibale = false">取消</el-button>
          <el-button text bg type="primary" @click="logVisibale = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, watch, reactive, onMounted, defineProps, inject, defineEmits, nextTick, computed } from 'vue'
import useClipboard from 'vue-clipboard3'
import store from '@/store'
import { queryHistoryLog, historyLogDetail, queryResult } from '@/api/data-query'
// import MoreBtn from '@/components/MoreBtn/index.vue'
import TaskResult from './tast-result.vue'
import useDownload from './download'

const DateFormat: any = inject('$DateFormat')

const props = defineProps({
  stateUp: Boolean,
  fullscreen: Boolean,
  height: {
    type: Number,
    default: 0
  },
  activeTab: String
})

const emit = defineEmits<{(event: 'previwHanleUp'): void }>()

const config: any = reactive({
  logHistory: [],
  sqlLog: [],
  total: 0
})
const viewStatus = ref(false)
const viewRes = ref({})

const pageSetting = reactive({
  pageSize: 100,
  page: 1
})

const sqlVisibale = reactive({
  visibale: false,
  sql: ''
})

const statusText: any = {
  '-1': '待审核',
  '0': '待处理',
  '1': '运行中',
  '2': '成功',
  '3': '失败',
  '4': '已取消'
}
const pageSizeOptions: any = [
  { label: '10条/页', value: 10 },
  { label: '20条/页', value: 20 },
  { label: '50条/页', value: 50 },
  { label: '100条/页', value: 100 }
]
const logVisibale = ref(false)
const resTable = ref()
const asyncFlag = ref(false)

const tableScrollTop = ref(0)
const scrollData = computed(() => {
  const height = props.fullscreen ? fullHeight() : tableHeight()
  const trNum = Math.ceil(height / 33)
  const beginRow = tableScrollTop.value > 0 ? Math.floor(tableScrollTop.value / 33) : 0
  const dataLength = config.logHistory.length
  const endRow = beginRow + trNum > dataLength + 1 ? dataLength + 1 : beginRow + trNum
  return config.logHistory.slice(beginRow, endRow) || []
})
const { toClipboard } = useClipboard()
const getTextWidth = (str: string) => {
  let width = 0
  const html = document.createElement('span')
  html.style.display = 'inline-block'
  html.style.fontSize = '12px'
  html.innerText = str
  html.className = 'getTextWidth'
  ;(window as any).document.querySelector('body').appendChild(html)
  width = (window as any).document.querySelector('.getTextWidth').clientWidth
  ;(window as any).document.querySelector('.getTextWidth').remove()
  return width
}
const cWidth = ref([])
const queryLogList = async (param: any) => {
  const list: any = await queryHistoryLog(param)
  config.logHistory = list.rows.length === 0 ? [] : list.rows
  resTable.value.$el.querySelector('.el-scrollbar__view').style.height = config.logHistory.length * 33 + 'px'
  config.total = list.total
  // if (list.total > 0) {
  //   emit('previwHanleUp')
  // }
  nextTick(() => {
    const arr: any = []
    const cells = resTable.value.$el.querySelectorAll('.cell')
    const headerCells = []
    const bodyCells: any = []
    for (let i = 0; i < cells.length; i++) {
      if (i < 9) {
        headerCells.push(cells[i])
      } else if (i > 8 && i < 18) {
        bodyCells.push(cells[i])
      } else {
        break
      }
    }
    headerCells.forEach((el: any, index: number) => {
      const headerWidth = getTextWidth(el.innerText)
      const cellWidth = bodyCells.length && getTextWidth(bodyCells[index].innerText)
      let width = Math.max(headerWidth, cellWidth)
      width = width > 300 ? 300 : width + 27
      arr.push(width)
    })
    cWidth.value = arr
  })
}
const currentView = ref({ jobId: '', sqlContent: '' })
const currentViewFn = (row: any) => {
  currentView.value = row
  viewResult({ jobId: row.jobId, pageNo: 1, pageSize: 100 })
}
const goRawgraphs = () => {
  window.open(`/rawgraphs?jobId=${currentView.value.jobId}&size=1000`)
}
const viewResult = (params: object) => {
  queryResult({
    ...params
  }).then((res: any) => {
    viewStatus.value = true
    viewRes.value = res
  })
}
const { loadingButtons, downloadFn } = useDownload()

// // 切换每页显示条数
const handleSizeChange = (size: number) => {
  pageSetting.pageSize = size
  queryLogList({
    page: pageSetting.page,
    pageSize: size,
    isSync: asyncFlag.value ? 0 : undefined
  })
}

// 切换页码
const handleCurrentChange = (page: number) => {
  pageSetting.page = page
  queryLogList({
    page: page,
    pageSize: pageSetting.pageSize,
    isSync: asyncFlag.value ? 0 : undefined
  })
}

let clicks = 0
const viewSql = (text: string) => {
  clicks++
  if (clicks === 1) {
    setTimeout(function () {
      if (clicks === 1) {
        sqlVisibale.visibale = true
        sqlVisibale.sql = text
      } else {
        copySql(text)
      }
      clicks = 0
    }, 300)
  }
}

const copySql = async (text: string) => {
  try {
    await toClipboard(text)
    ElMessage({
      message: '复制成功',
      type: 'success'
    })
  } catch (e) {
    console.error(e)
  }
}

const sqlConfirm = () => {
  sqlVisibale.visibale = false
}

const searchLog = async (jobId: string) => {
  logVisibale.value = true
  const log: any = await historyLogDetail({ jobId })
  config.sqlLog = log
}

const runClick = (data: any) => {
  if (store.state.app.tabs.length === 20) {
    ElMessage({
      type: 'warning',
      message: '最多新开20个Tab'
    })
    return
  }
  const center = data.dataCenter && data.dataCenter.toLowerCase()
  const source = data.dataSource && data.dataSource.toLowerCase()
  const contentStr = `--${data.dataSource} ${['hive', 'spark', 'presto', 'doris'].includes(source) ? center : ''}\n${
    data.sqlContent
  }`
  const obj = {
    sqlId: data.id,
    dataSource: data.dataSource,
    dataCenter: data.dataCenter,
    queryEngine: data.queryEngine,
    content: contentStr,
    taskStatus: 'running',
    isHistoryRun: true
  }
  store.dispatch('app/addTabs', { ...obj })
  // emit('runSql', obj)
}
const tableHeight = () => {
  return props.height - 70
}
const fullHeight = () => {
  return document.body.clientHeight - 120
}
onMounted(async () => {
  await queryLogList({ ...pageSetting })
  if (config.total > 0) {
    emit('previwHanleUp')
  }
  const wrapDom = resTable.value.$el.querySelector('.el-scrollbar__wrap')
  resTable.value.$el.querySelector('.el-table__body').style = 'position: sticky; top: 0'
  wrapDom.addEventListener('scroll', () => {
    tableScrollTop.value = wrapDom.scrollTop
    // resTable.value.$el.querySelector('.el-scrollbar__view').style.paddingTop = wrapDom.scrollTop + 'px'
  })
})

watch(
  () => props.activeTab,
  (val) => {
    if (val === 'third') {
      asyncFlag.value ? queryLogList({ isSync: 0, ...pageSetting }) : queryLogList({ ...pageSetting })
    }
  }
)
watch(asyncFlag, (_val) => {
  asyncFlag.value ? queryLogList({ isSync: 0, ...pageSetting }) : queryLogList({ ...pageSetting })
})
</script>

<style scoped lang="scss">
:deep(.dark .el-table__header-wrapper tr th.el-table-fixed-column--left, .dark
    .el-table__header-wrapper
    tr
    th.el-table-fixed-column--right) {
  background-color: unset;
}
.execStatus {
  margin-bottom: 2px;
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-right: 2px;
}
.color-1 {
  background-color: #6d6d6e;
}
.color0 {
  background-color: #e6a23c;
}
.color1 {
  background-color: #409eff;
}
.color2 {
  background-color: #67c23a;
}
.color3 {
  background-color: #f56c6c;
}
.color4 {
  background-color: #909399;
}
.download {
  color: #01b85c;
}

.results-body {
  margin-top: 5px;
}
:deep(.el-checkbox.el-checkbox--large .el-checkbox__label) {
  font-size: 12px;
}
.history {
  padding: 6px 16px 0px 16px;
  overflow: auto;
  :deep(.el-table .el-table__cell) {
    padding: 4px 0;
  }
  :deep(.el-checkbox.el-checkbox--large) {
    height: auto;
  }
  .history-head {
    display: flex;
    justify-content: space-between;
    p:first-child {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 20px;
      height: 20px;
    }
    p:last-child {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 20px;
      height: 20px;
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
.fact-pagination-context {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.fact-pagination {
  margin-top: 5px;
}
.copy-text {
  margin-bottom: 12px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #00b85c;
  line-height: 20px;
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
.dashboard {
  font-size: 14px;
  position: relative;
  top: 3px;
  margin-right: 15px;
  margin-left: 10px;
  cursor: pointer;
  color: var(--tab-icon-color);
  :hover {
    color: var(--tab-icon-hover-color);
  }
}
:deep(.el-button + .el-button) {
  margin-left: 7px;
}
:deep(.el-button--small) {
  padding: 5px;
}
.view-result {
  position: absolute;
  top: 33px;
  background: var(--bg-color);
  z-index: 111;
  width: 100%;
  height: 100%;
}
.back-btn {
  display: inline-block;
  color: #01b85c;
  cursor: pointer;
}
</style>
