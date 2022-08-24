<template>
  <div class="codeBox" :style="{ height: height + 'px' }" @click="rightMenu = false" @contextmenu.prevent="rightClick">
    <div ref="inputContainer" class="inputContainer">
      <span v-if="variableList.length !== 0" class="iconfont icon-fuzhi" style="margin: 8px; font-size: 20px"></span>
      <div v-if="variableList.length !== 0" class="var-items">
        <el-scrollbar noresize>
          <div
            v-for="(item, index) in variableList"
            :key="index"
            style="display: flex; flex-shrink: 0; align-items: center"
          >
            <span style="line-height: 22px; margin: 0 5px">{{ item.key }}:</span>
            <el-input
              v-model="item.value"
              style="height: 27px; font-size: 12px; margin-top: 5px; margin-bottom: 4px"
              type="text"
              label="item.key"
              :placeholder="'请输入' + item.key"
            ></el-input>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <Codemirror
      ref="cmRefDom"
      :value="code"
      :options="cmOptions"
      placeholder="使用说明:&#10;1.双击左侧表可快速预览数据&#10;2.智能路由无需选择引擎, 并会尝试 Doris 或 Presto 加速&#10;例如:&#10;select * from db.table; &#10;&#10;高级用法(指定引擎不会尝试加速):&#10;1.指定查询引擎，只需在SQL上方加&quot;--[查询引擎名称]&quot;&#10;例如:&#10;--spark&#10;select * from db.table;&#10;&#10;2.指定查询引擎及大数据集群，只需在SQL上方加&quot;--[查询引擎名称] [大数据集群名称]&quot;&#10;例如:&#10;--spark safe_lycc&#10;select * from db.table;&#10;&#10;查询引擎名称: spark, spk, presto, pst, hive, doris, mysql&#10;大数据集群名称: safe_lycc|safelycc|sfly (一般业务集群), bjmd (风控建模及策略集群)&#10;doris集群名称:dw_faster_doris(自助查询加速集群), report_doris(报表集群), rta_doris(广告投放集群)"
      border
      :height="variableList.length ? height - 37 : height - 1"
      @change="change"
      @inputRead="inputRead"
      @cursorActivity="cursorActivity"
      @blur="blurFlag = true"
      @focus="blurFlag = false"
    />
    <div v-show="rightMenu" class="contextMenu" :style="style.position">
      <p @click="runSql('cur')">执行当前SQL</p>
      <p @click="runSql('all')">执行全部SQL</p>
    </div>
  </div>
</template>
<script lang="ts">
import { onMounted, ref, reactive, watch, computed } from 'vue'
import Codemirror, { CmComponentRef } from 'codemirror-editor-vue3'
import store from '@/store'
// import sqlFormatter from 'sql-formatter'
import './codemirror-config.ts'

export default {
  name: 'Sqleditor',
  components: { Codemirror },
  props: {
    code: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 282
    },
    defaultTable: {
      type: Object,
      default: () => {}
    },
    defaultConfig: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['sql-change', 'run-sql'],
  setup(props: any, context: any) {
    const cmRefDom = ref<CmComponentRef>(null)
    const cminstance = ref() // codemirror 实例对象
    const rightMenu = ref(false)
    const cursorSql = ref('')
    const blurFlag = ref(false)
    const style = reactive({
      position: { top: '0', left: '0' }
    })
    const cmOptions = reactive({
      mode: 'text/x-mariadb',
      matchBrackets: true, // 播号高亮四配 theme:"default", keyMap:"default",
      theme: store.state.app.themes === 'dark' ? 'blackboard' : 'default', // Theme
      extraKeys: { Alt: 'autocomplete', 'Ctrl-/': 'toggleComment', 'Shift-Enter': () => {} }, // 自定义快捷键
      lineWrapping: true, // 是否换行
      foldGutter: true, // 是否折合
      lineNumbers: true,
      autocomplete: true,
      qutters: ['CodeMirror-linenumbers', 'CodeMirror-foldqutter'], // 然加行号栏，折香栏 hintOptions:{

      indentWithTabs: true,
      smartIndent: true,
      cursorHeight: 1,
      readOnly: false,
      autofocus: true,
      continueComments: 'Enter',
      hintOptions: {
        // 自定义提示选项
        // 当匹配只有一项的时候是否自动补全
        completeSingle: false,
        // tables: {
        //   tidb: ['ods_lps_ap_appl', 'xxl_job_monitor']
        // }
        tables: props.defaultTable
        // closeCharacters: /\s/
      },
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
    })
    watch(
      () => store.state.app.themes,
      (newVal) => {
        if (newVal === 'dark') {
          cmOptions.theme = 'blackboard'
        } else {
          cmOptions.theme = 'default'
        }
      }
    )
    onMounted(() => {
      cminstance.value = cmRefDom.value && cmRefDom.value.cminstance
      cminstance.value.focus()
    })

    const change = (val: any) => {
      const arr = getExecStrs(val)
      store.dispatch('app/setVarList', { tabId: props.defaultConfig.id, arr: arr })
      context.emit('sql-change', val)
    }
    const inputRead = (e: any) => {
      if (
        /-$/.test(e.display.input.prevInput) ||
        /;+$/.test(e.display.input.prevInput) ||
        /\s+$/.test(e.display.input.prevInput)
      ) {
        return
      } else {
        cminstance.value.showHint()
      }
    }
    const getUpAndDownContent = (editor: any, cursor: any) => {
      let up = ''
      let down = ''
      const allLine = editor.lineCount()
      const { line, ch } = cursor
      const current_line = editor.doc.getLine(line) // 光标当前行内容
      const current_line_start = current_line.substring(0, ch) // 当前行光标之前的内容
      const current_line_end = current_line.substring(ch, current_line.length) // 当前行光标之后的内容
      if (line === 0) {
        return {
          up: current_line_start,
          down: current_line_end
        }
      }
      for (let i = 0; i <= line; i++) {
        if (i === line) {
          up = `${up}${current_line_start}`
        } else {
          up = `${up}${editor.doc.getLine(i)}\n`
        }
      }
      for (let i = line; i < allLine; i++) {
        if (i === line) {
          down = `${down}${current_line_end}\n`
        } else {
          down = `${down}${editor.doc.getLine(i)}`
        }
      }
      return {
        up,
        down
      }
    }
    const cursorActivity = (e: any) => {
      const { up } = getUpAndDownContent(cminstance.value, cminstance.value.getCursor())
      const sql = getCursorTouchSql(e.getValue(), up.length)
      cursorSql.value = sql
    }
    const getCursorTouchSql = (sqlsInput: any, cursorPosition: any) => {
      // 如果光标放在分号结尾，且后续为换行符时执行光标所在当前行
      if (
        (cursorPosition > 0 &&
          cursorPosition < sqlsInput.length &&
          sqlsInput[cursorPosition - 1] === ';' &&
          sqlsInput[cursorPosition] === '\n') ||
        cursorPosition === sqlsInput.length
      ) {
        cursorPosition -= 1
      }
      const head = sqlsInput.substring(0, cursorPosition)
      const tail = sqlsInput.substring(cursorPosition, sqlsInput.length)
      const headSplit = head.split(';')
      const tailSplit = tail.split(';')
      const runSql = headSplit[headSplit.length - 1] + tailSplit[0]
      return runSql
    }
    const rightClick = (ev: any) => {
      rightMenu.value = !!props.code
      style.position = {
        top: ev.clientY + 'px',
        left: ev.clientX + 'px'
      }
      return false
    }
    const runSql = (type: string) => {
      rightMenu.value = false
      const params = type === 'cur' ? { sqlContent: cursorSql.value, isSync: 1 } : { isSync: 1 }
      context.emit('run-sql', params)
    }

    const getExecStrs = (str: string) => {
      const reg = /\$\{(.+?)\}/g
      const list: any = []
      let result = null
      do {
        result = reg.exec(str)
        if (result) {
          const item: any = {}
          item.key = result[1]
          item.value = ''
          for (let i = 0; i < store.state.app.variableList.length; i++) {
            if (item.key === store.state.app.variableList[i].key) {
              item.value = store.state.app.variableList[i].value
              break
            }
          }
          const flag = list.some((i: any) => i.key === item.key)
          if (!flag) {
            list.push(item)
          }
        }
      } while (result)
      return list
    }
    const variableList = computed(() => store.state.app.variableList[props.defaultConfig.id] || [])
    return {
      change,
      inputRead,
      cursorActivity,
      rightClick,
      runSql,
      blurFlag,
      cmRefDom,
      cminstance,
      cursorSql,
      rightMenu,
      style,
      cmOptions,
      getExecStrs,
      variableList
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.CodeMirror) {
  font-size: 14px;
  background: var(--sql-bg-color);
  pre.CodeMirror-placeholder {
    //#c5c5c5浅   #666深
    color: var(--sql-placeholder-color) !important;
    font-size: 14px;
  }
}
:deep(.codemirror-container.bordered) {
  border-color: var(--tab-border-color);
  border-radius: unset;
}
:deep(.CodeMirror-gutters) {
  background-color: var(--sql-menu-bar-bgcolor);
  border-right-color: var(--tab-border-color);
}
:deep(.CodeMirror-linenumber) {
  text-align: center;
}
:deep(.CodeMirror-scroll) {
  position: static;
  padding-bottom: 0;
}
.codeBox {
  position: relative;
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
.var-items {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}
.var-items :deep(.el-scrollbar__view) {
  display: flex;
}
.inputContainer {
  display: flex;
  flex-wrap: wrap;
  color: #a6a6a6;
  border-left: 1px solid var(--tab-border-color);
  border-top: 1px solid var(--tab-border-color);
}
</style>
