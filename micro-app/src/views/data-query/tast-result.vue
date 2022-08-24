<template>
  <div class="results" :style="{ maxHeight: 'fit-content' }">
    <div class="results-head">
      <p @click="viewSql(props.sqlContent || '')">
        {{ props.sqlContent }}
        <!-- <span v-if="showBlodLimit()" :style="{ 'font-weight': 'bold' }">
          {{
            props.actualExeSql.substring(props.sqlContent.length - 1, props.actualExeSql.length)
          }}
        </span> -->
        <span v-if="showBlodLimit()" :style="{ 'font-weight': 'bold' }">
          {{ 'LIMIT ' + props.actualExeSql.split('LIMIT')[1] }}
        </span>
      </p>
      <p>
        <slot>
          运行完成，耗时<span>{{ props.item.costTimeMill || 0 }}ms</span>，查询结果<span>{{ props.item.totalCount || 0 }}行</span>
          <el-tooltip class="box-item" effect="dark" content="图表制作" placement="bottom">
            <I
              v-if="props.item.totalCount > 0 && props.item.jobId"
              class="dashboard"
              name="PieChart"
              @click="goRawgraphs"
            ></I>
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" content="复制" placement="bottom">
            <I v-if="props.item.totalCount > 0" class="icon-btn" name="DocumentCopy" @click="copyDocument" />
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" content="下载" placement="bottom">
            <el-button text class="download-btn" :loading="loadingButtons.includes(props.item.jobId)">
              <I
                v-if="props.item.totalCount > 0 && props.item.jobId && !loadingButtons.includes(props.item.jobId)"
                class="download icon-btn iconfont icon-xiazai"
                @click="downloadFn(props.item.jobId)"
              ></I>
            </el-button>
          </el-tooltip>
        </slot>
      </p>
    </div>
    <div v-if="toggleTable" class="results-body">
      <el-auto-resizer>
        <template #default="{ width }">
          <el-table-v2
            ref="tableV2"
            :width="width"
            :height="props.fullscreen ? fullHeight() : tableHeight()"
            :row-height="32"
            :header-height="32"
            fixed
            :columns="newColumns.length ? newColumns : columns"
            :data="tableData || []"
            :header-class="!tableData.length ? 'hide-border' : ''"
            @mousedown="onMousedown"
            @mouseup="onMouseUp"
            @mousemove="onMouseMove"
          >
          </el-table-v2>
        </template>
      </el-auto-resizer>
      <div
        v-show="showLine > 0"
        class="drag-line"
        :style="{ height: (props.fullscreen ? fullHeight() : tableHeight()) + 'px', left: `${showLine}px` }"
      ></div>
      <div v-show="!!props.item.jobId" class="fact-pagination-context">
        <el-pagination
          :current-page="props.item.page"
          class="fact-pagination"
          :page-size="props.item.pageSize"
          :background="true"
          layout="total, slot, prev, pager, next, jumper"
          :total="props.item.totalCount || 0"
          small
          @current-change="handleCurrentChange"
        >
          <el-select v-model="props.item.pageSize" :teleported="false" @change="handleSizeChange">
            <el-option v-for="item in pageSizeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-pagination>
      </div>
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
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, defineProps, computed, defineEmits, onMounted, onDeactivated, watch } from 'vue'
import useClipboard from 'vue-clipboard3'
// import store from '@/store'
import useDragWidth from './drag-columns-width'
import useDownload from './download'
// import { queryResult } from '@/api/data-query'
const pageSizeOptions: any = [
  { label: '10条/页', value: 10 },
  { label: '20条/页', value: 20 },
  { label: '50条/页', value: 50 },
  { label: '100条/页', value: 100 }
]
const tableV2 = ref()
watch(
  () => props.activeTab,
  (val) => {
    if (val !== 'third' && val !== 'first') {
      updateTable()
      tableV2.value.scrollTo({ scrollLeft: 0, scrollTop: 0 })
    }
  }
)

watch(
  () => props.item,
  () => {
    updateTable()
  }
)

const { toClipboard } = useClipboard()
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  stateUp: Boolean,
  fullscreen: Boolean,
  sqlContent: {
    type: String,
    default: () => ''
  },
  actualExeSql: {
    type: String,
    default: () => ''
  },
  height: {
    type: Number,
    default: 0
  },
  activeTab: String
})
const sqlVisibale = reactive({
  visibale: false,
  sql: ''
})

const {
  showLine,
  toggleTable,
  newColumns,
  onMousedown,
  onMouseMove,
  onMouseUp,
  getTextWidth,
  updateTable
} = useDragWidth(props)

const columns = computed(() => {
  const list = props.item.columnNameList || []
  const cells = props.item.resultData && props.item.resultData[0]
  return list.map((c: any, index: number) => {
    let width
    if (props.item.columnObj && props.item.columnObj[index]) {
      width = props.item.columnObj[index]
    } else {
      const headerWidth = getTextWidth(c) + 13
      const cellWidth = cells ? getTextWidth(cells[index]) + 13 : 0
      width = Math.max(headerWidth, cellWidth)
      width = width > 300 ? 300 : width
      width = width < 30 ? 30 : width
      if (props.item.columnObj) {
        props.item.columnObj[index] = width
      } else {
        props.item.columnObj = { [index]: width }
      }
    }
    return {
      key: `${index}`,
      dataKey: `${index}`,
      title: `${c}`,
      width: props.item.columnObj[index]
    }
  })
})

const goRawgraphs = () => {
  window.open(`/rawgraphs?jobId=${props.item.jobId}&size=1000`)
}

const tableHeight = () => {
  if (!tableData.value.length) {
    return props.height - 60
  }
  let height = props.height - 68
  if (!props.item.jobId) {
    // 刨除页面高度
    height += 35
  }
  return (tableData.value.length + 1) * 32 > height ? height : (tableData.value.length + 1) * 32
}
const fullHeight = () => {
  return document.body.clientHeight - 100
}
const showBlodLimit = () =>
  props.sqlContent.toLowerCase().indexOf('limit') < 0 &&
  props.actualExeSql &&
  props.actualExeSql.toLowerCase().indexOf('limit') > 0 &&
  props.sqlContent !== props.actualExeSql

const { loadingButtons, downloadFn } = useDownload()

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

const tableData = computed(() => {
  return props.item.resultData.map((arr: any[]) => {
    const res: any = {}
    // eslint-disable-next-line no-return-assign
    arr.forEach((item, index) => (res[index] = item || '-'))
    return res
  })
})

const emit = defineEmits<{(event: 'update-result', param: any): void }>()
// 请求table数据
const queryLogList = async (param: any) => {
  emit('update-result', param)
}

// 切换每页显示条数
const handleSizeChange = (size: number) => {
  queryLogList({
    pageNo: props.item.page,
    pageSize: size
  })
}

// 切换页码
const handleCurrentChange = (page: number) => {
  queryLogList({
    pageNo: page,
    pageSize: props.item.pageSize
  })
}

// const transformArrToTabelArr = (result: any) => {
//   console.log(1111, result)
//   return result.map((arr: any[]) => {
//     const res: any = {}
//     // eslint-disable-next-line no-return-assign
//     arr.forEach((item, index) => (res[index] = item || '-'))
//     return res
//   })
// }
const dbCopy = (e: any) => {
  if (e.path[0].className === 'el-table-v2__cell-text' || e.path[0].className === 'el-table-v2__header-cell-text') {
    copySql(e.path[0].innerText)
  }
}

const copyEvent = ref(false)
const copyDocument = () => {
  copyEvent.value = true
  window.document.execCommand('copy')
}
const copyFn = (event: any) => {
  if (copyEvent.value) {
    if (event.clipboardData || event.originalEvent) {
      const clipboardData = event.clipboardData || event.originalEvent.clipboardData
      // 拼接数据
      const first = columns.value.map((item: any) => item.title).join('\t')
      const sec = tableData.value
        .map((item: any) => {
          let str = ''
          columns.value.forEach((_: any, index: number) => {
            str += `${item[index]}\t`
          })
          return str
        })
        .join('\n')
      const selection = `${first}\n${sec}`
      clipboardData.setData('text/plain', selection.toString())
      event.preventDefault()
      copyEvent.value = false // 关掉开关
      ElMessage({
        message: '复制成功',
        type: 'success'
      })
    }
  }
}

onMounted(() => {
  window.document.ondblclick = dbCopy
  window.document.addEventListener('copy', copyFn)
})

onDeactivated(() => {
  window.document.removeEventListener('dblclick', dbCopy)
  window.document.removeEventListener('copy', copyFn)
})
</script>

<style scoped lang="scss">
.drag-line {
  pointer-events: none;
  position: absolute;
  cursor: col-resize;
  top: 0;
  bottom: 0;
  width: 5px;
  border-left: 1px solid var(--table-border-color);
  z-index: 10;
}
:deep(.el-table-v2) {
  font-size: 12px;
  .el-table-v2__cell-text {
    color: var(--el-table-text-color);
  }
  .el-table-v2__header-cell-text {
    color: var(--el-table-text-color);
  }
  .el-empty__image {
    display: none;
  }
  .hide-border {
    border-bottom: unset;
  }
}
:deep(.el-table-v2__root:hover .el-table-v2__main .el-virtual-scrollbar) {
  right: 0 !important;
  bottom: 0 !important;
}
:deep(.el-table-v2__root .el-table-v2__main .el-virtual-scrollbar) {
  right: 0 !important;
  bottom: 0 !important;
}
:deep(.el-table-v2__main) {
  background-color: unset;
  border: 1px solid var(--table-border-color);
}
:deep(.el-table-v2__row-cell) {
  border-right: 1px solid var(--table-border-color);
}
:deep(.el-table-v2__header-cell) {
  border-right: 1px solid var(--table-border-color);
  position: relative;
}
:deep(.el-table-v2__header-cell::after) {
  position: absolute;
  content: '';
  width: 5px;
  height: 30px;
  cursor: col-resize;
  right: 0;
}

.copy-text {
  margin-bottom: 12px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #00b85c;
  line-height: 20px;
}
.results {
  padding: 6px 16px 0px 16px;
  overflow: auto;
  :deep(.el-table .el-table__cell) {
    padding: 4px 0;
  }
  .results-head {
    display: flex;
    justify-content: space-between;
    p:first-child {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #00b85c;
      line-height: 20px;
      flex: 1;
      white-space: nowrap; /*内容超宽后禁止换行显示*/
      overflow: hidden; /*超出部分隐藏*/
      text-overflow: ellipsis; /*文字超出部分以省略号显示*/
    }
    p:last-child {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 20px;
      :deep(.el-button.is-text:not(.is-disabled):hover) {
        background-color: unset;
      }
    }
  }
  .results-body {
    margin-top: 5px;
    position: relative;
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
.dashboard {
  font-size: 14px;
  position: relative;
  top: 3px;
  margin-right: 10px;
  margin-left: 10px;
  cursor: pointer;
  color: var(--tab-icon-color);
  :hover {
    color: var(--tab-icon-hover-color);
  }
}
.icon-btn {
  position: relative;
  top: 3px;
  cursor: pointer;
  color: var(--tab-icon-color);
  :hover {
    color: var(--tab-icon-hover-color);
  }
}
.download-btn {
  height: 16px;
  padding: 0 4px;
  margin-left: 6px;
  width: 16px;
  color: var(--tab-icon-color);
  :hover {
    color: var(--tab-icon-hover-color);
  }
  span {
    .download {
      top: 0px;
      margin-left: 6px;
      width: 16px;
      color: currentColor;
    }
  }
}
// --table-border-color
</style>
