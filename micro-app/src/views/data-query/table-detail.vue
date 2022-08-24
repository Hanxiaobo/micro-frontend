<template>
  <el-tabs v-model="activeName" type="card" class="demo-tabs">
    <el-tab-pane label="字段信息" name="first">
      <el-table :data="detail.gridData" max-height="400px">
        <el-table-column property="columnName" label="字段名称" max-width="150" min-width="80" />
        <el-table-column property="columnComment" label="字段说明" max-width="200" min-width="100" />
        <el-table-column property="columnType" label="数据类型" />
        <el-table-column property="columnLength" label="长度" />
        <el-table-column property="requiredFlag" label="是否必填" />
        <el-table-column property="primaryFlag" label="是否主键" />
        <el-table-column v-if="dataSource !== 'mysql'" property="partitionedFlag" min-width="120" label="是否分区建" />
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="DDL" name="second">
      <Codemirror
        v-show="!!detail.DDLMsg"
        ref="cmRefDom"
        :value="detail.DDLMsg"
        height="300"
        :options="cmOptions"
        border
      />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts">
import { reactive, onMounted, ref, watch } from 'vue'
import Codemirror, { CmComponentRef } from 'codemirror-editor-vue3'
import sqlFormatter from 'sql-formatter'
import { queryHiveTableDDL, queryTableColumn } from '@/api/data-query'
import store from '@/store'
import './codemirror-config.ts'

export default {
  name: 'TableDetail',
  components: { Codemirror },
  props: {
    ddlParams: {
      type: Object,
      default: () => {}
    },
    dialogTableVisible: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any) {
    const cmRefDom = ref<CmComponentRef>(null)
    const cminstance = ref() // codemirror 实例对象
    const activeName = ref('first')
    const detail: any = reactive({
      gridData: [],
      DDLMsg: ''
    })
    //     db->database
    // dc-> dataCenter
    // ds->dataSource
    // name->table
    const getHiveTableDDL = async () => {
      const DDLMsg = await queryHiveTableDDL({
        database: props.ddlParams.db,
        dataCenter: props.ddlParams.dc,
        dataSource: props.ddlParams.ds,
        table: props.ddlParams.name
      })
      detail.DDLMsg = sqlFormatter.format(DDLMsg)
    }
    const getfield = async () => {
      const gridData = await queryTableColumn({
        database: props.ddlParams.db,
        dataCenter: props.ddlParams.dc,
        dataSource: props.ddlParams.ds,
        table: props.ddlParams.name
      })
      detail.gridData = gridData
    }
    onMounted(() => {
      cminstance.value = cmRefDom.value && cmRefDom.value.cminstance
      // cminstance.value.setOption('readOnly', true)
      getfield()
    })
    watch(activeName, (val) => {
      if (val === 'second' && !detail.DDLMsg) {
        getHiveTableDDL()
      }
    })
    return {
      activeName,
      detail,
      dataSource: props.ddlParams.dataSource,
      cmRefDom,
      cmOptions: {
        mode: 'text/x-mariadb',
        matchBrackets: true, // 播号高亮四配 theme:"default", keyMap:"default",
        theme: store.state.app.themes === 'dark' ? 'blackboard' : 'default', // Theme
        extraKeys: { Alt: 'autocomplete', 'Ctrl-/': 'toggleComment' }, // 自定义快捷键
        lineWrapping: true, // 是否换行
        foldGutter: true, // 是否折合
        lineNumbers: true,
        autocomplete: true,
        qutters: ['CodeMirror-linenumbers', 'CodeMirror-foldqutter'], // 然加行号栏，折香栏 hintOptions:{
        indentWithTabs: true,
        smartIndent: true,
        cursorHeight: 1,
        readOnly: true,
        autofocus: true,
        continueComments: 'Enter',
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.codemirror-container.bordered) {
  border-color: var(--sql-menu-bar-border-color);
  border-radius: unset;
}
</style>
