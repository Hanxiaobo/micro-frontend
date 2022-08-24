<template>
  <div class="upload">
    <el-upload
      ref="uploadRef"
      action=""
      :limit="1"
      :on-exceed="handleExceed"
      :auto-upload="false"
      :data="{
        tmpTableName: props.uploadType === 0 ? `ods_offline.${ruleForm.name}` : ruleForm.name,
        tmpTableDesc: ruleForm.desc,
        type: props.uploadType
      }"
      accept=".csv,.xlsx,.xls"
      :on-change="onChange"
      style="height: 70px"
      :on-success="uploadSuccess"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-error="onError"
    >
      <template #trigger>
        <el-button class="upload-btn" text bg :icon="Upload">上传文件</el-button>
      </template>
      <template #tip>
        <div class="el-upload__tip">文件类型只支持csv、xlsx和xls，限制文件大小200MB(csv非逗号分隔符不支持解析)</div>
      </template>
      <div v-show="fileList.length > 0" class="upload-mask"></div>
    </el-upload>

    <el-form ref="formRef" :model="ruleForm" :rules="rules" label-width="110px">
      <I
        v-show="validateName"
        name="Loading"
        class="is-loading"
        style="float: right; right: 90px; top: 6px; color: #00b85c"
      >
      </I>
      <el-form-item v-if="props.uploadType === 0" label="临时表名称：" prop="name">
        ods_offline.
        <el-input v-model="ruleForm.name" style="width: 150px; margin: 0 8px" placeholder="请输入" />
      </el-form-item>
      <el-form-item v-if="props.uploadType === 1" label="临时表名称：" prop="name">
        <el-select
          v-model="ruleForm.name"
          filterable
          style="width: 240px"
          placeholder="请选择"
          :loading="loadingOption"
          @visible-change="visibleChange"
        >
          <el-option v-for="item in offlineTables" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="临时表描述：" prop="desc">
        <el-input v-model="ruleForm.desc" placeholder="请输入" type="textarea" />
      </el-form-item>
      <div class="item-tips">
        <span
          class="row"
        >行数：<el-button size="small" text :loading="analysisLoading">{{
          analysisLoading ? '' : ranks.row
        }}</el-button>行</span>
        <span
          class="row"
        >列数：<el-button size="small" text :loading="analysisLoading">{{
          analysisLoading ? '' : ranks.column
        }}</el-button>列</span>
      </div>
    </el-form>
    <div class="tips">
      <div>提示：</div>
      <div v-if="props.uploadType === 0">
        <p>1、一经创建，按储存可查找。</p>
        <p>2、默认首行是字段信息。</p>
      </div>
      <div v-if="props.uploadType === 1">
        <p>1、一经覆盖不可回滚。</p>
        <p>2、默认首行是字段信息。</p>
      </div>
    </div>
    <div class="dialog-footer">
      <span>
        <el-button text bg @click="closeDialog">取消</el-button>
        <el-button :loading="creatLoading" text bg type="primary" @click="creatFn">
          {{ props.uploadType === 1 ? '覆盖' : '创建' }}
        </el-button>
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineEmits, defineProps, watch } from 'vue'
import type { UploadInstance, UploadRawFile } from 'element-plus'
import { genFileId, ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'
import { queryOdsOfflineTable, checkTableName } from '@/api/data-query'

const emit = defineEmits<{(event: 'close-dialog'): void }>()
const props = defineProps({
  uploadType: {
    type: Number,
    default: () => 0
  }
})
const offlineTables: any = ref([])
watch(
  () => props.uploadType,
  (val: number) => {
    if (val === 1) {
      validateName.value = false
    }
    formRef.value.resetFields()
    ruleForm.value = {
      name: '',
      desc: ''
    }
    ranks.value = {
      row: 0,
      column: 0
    }
    uploadRef.value!.clearFiles()
    fileList.value = []
  }
)

const ruleForm = ref({
  name: '',
  desc: ''
})
const validateName = ref(false)
const validatePass = async (_: any, value: any, callback: any) => {
  if (props.uploadType === 1) {
    if (value === '') {
      callback(new Error('请选择临时表名称'))
    } else {
      callback()
    }
    return
  }
  const reg = /^[a-zA-Z_][a-zA-Z0-9_]{1,50}$/gi
  if (value === '') {
    callback(new Error('请输入临时表名称'))
  } else if (!reg.test(value)) {
    callback(new Error('只支持英文、数字、下划线，不能以数字开头，最多50个字符'))
  } else {
    validateName.value = true
    const res = await checkTableName({
      tableName: `
ods_offline.${value}`
    })
    validateName.value = false
    if (res) {
      callback('表名重复，请重新输入')
    } else {
      callback()
    }
  }
}
const rules = {
  name: [{ required: true, validator: validatePass, trigger: 'blur' }],
  desc: [{ required: true, message: '请输入临时表描述', trigger: 'blur' }]
}
const loadingOption = ref(true)
const visibleChange = async (val: boolean) => {
  if (val) {
    loadingOption.value = true
    const res = await queryOdsOfflineTable()
    offlineTables.value = res || []
    loadingOption.value = false
  }
}
const uploadRef = ref<UploadInstance>()
const formRef = ref()
const submitUpload = () => {
  uploadRef.value!.submit()
}
const closeDialog = () => {
  emit('close-dialog')
}

const creatLoading = ref(false)
const creatFn = async () => {
  creatLoading.value = true
  if (!ranks.value.row) {
    ElMessage({
      type: 'warning',
      message: '文件数据不能为空！'
    })
    creatLoading.value = false
    return
  }
  await formRef.value.validate((valid: any) => {
    if (valid) {
      // 先判断用户是否上传了文件
      submitUpload()
    } else {
      creatLoading.value = false
    }
  })
}
const uploadSuccess = () => {
  creatLoading.value = false
  closeDialog()
  const str = props.uploadType === 1 ? '覆盖' : '创建'
  ElMessage({
    type: 'success',
    message: `操作成功，可在【运行历史】中查看${str}状态`,
    duration: 5000
  })
}

const handleExceed = (files: any) => {
  console.log(files, 'handleExceed')
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}
// const csvToArray = (str: string) => {
//   const delimiter = ','
//   const headers = str.slice(0, str.indexOf('\n')).split(delimiter)
//   const rows = str.slice(str.indexOf('\n') + 1).split('\n')

//   const arr = rows.map((row: string) => {
//     const values = row.split(delimiter)
//     const el = headers.reduce((object: any, header: string, index) => {
//       object[header] = values[index]
//       return object
//     }, {})
//     return el
//   })

//   // return the array
//   return arr
// }
const ranks = ref({
  row: 0,
  column: 0
})
const analysisLoading = ref(false)
const fileList = ref([])
const onChange = (file: any, files: any) => {
  fileList.value = files
  ranks.value = { row: 0, column: 0 }
  analysisLoading.value = true
  const reader = new FileReader()
  if (file.raw.name.slice(-4) === '.csv') {
    // csv
    reader.readAsArrayBuffer(file.raw)
    reader.onload = function (evt: any) {
      // const data = evt.target.result // 读到的数据
      const data = new Uint8Array(evt.target.result)
      const workbook = XLSX.read(data, {
        type: 'array'
      })
      // const arr = csvToArray(data)
      const wsname = workbook.SheetNames[0] // 取第一张表
      const arr: any = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) // 生成json表格内容
      analysisLoading.value = false
      // if (arr.length && arr.length === 2 && Object.keys(arr[0]).length === 1) {
      //   ElMessage({
      //     type: 'warning',
      //     message: '文件内容格式错误！'
      //   })
      //   return
      // }

      if (!arr.length || !data) {
        ElMessage({
          type: 'warning',
          message: '文件数据不能为空！'
        })
        return
      }
      ranks.value = {
        row: arr.length - 1 > 0 ? arr.length - 1 : 0,
        column: arr.length > 0 ? Object.keys(arr[0]).length : 0
      }
    }
  } else if (file.raw.name.slice(-4).indexOf('xls') > -1) {
    // xlsx
    reader.readAsBinaryString(file.raw)
    reader.onload = function (evt: any) {
      const data = evt.target.result // 读到的数据
      const wb = XLSX.read(data, { type: 'binary' })
      const arr: Array<any> = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      analysisLoading.value = false
      if (!arr.length) {
        ElMessage({
          type: 'warning',
          message: '文件数据不能为空！'
        })
        return
      }
      ranks.value = {
        row: arr.length > 0 ? arr.length : 0,
        column: arr.length > 0 ? Object.keys(arr[0]).length : 0
      }
    }
  } else {
    analysisLoading.value = false
    uploadRef.value!.clearFiles()
    ElMessage({
      type: 'error',
      message: '只支持csv/xlsx/xls类型文件！'
    })
    return
  }

  if (file.size / 1024 / 1024 > 200) {
    ElMessage({
      type: 'warning',
      message: '上传文件最大200MB！'
    })
    uploadRef.value!.clearFiles()
    analysisLoading.value = false
  }
}
const onRemove = (_: any, files: any) => {
  fileList.value = files
  analysisLoading.value = false
  ranks.value = { row: 0, column: 0 }
}
// const randomCode = () => {
//   const code = 'abcdefghijklmnopqrstuvwxyz1234567890'
//   let str = ''
//   for (let i = 0; i < 4; i++) {
//     str += code[Math.floor(Math.random() * 1000) % 36]
//   }
//   return str
// }
const onError = (error: any) => {
  console.log(error, 'error')
  ElMessage({
    type: 'error',
    message: error
  })
}
</script>
<style lang="scss" scoped>
.tips {
  display: flex;
  color: #8c8c8c;
  font-size: 12px;
}
.upload-mask {
  width: 108px;
  height: 32px;
  display: inline-block;
  position: absolute;
  left: 20px;
  cursor: not-allowed;
}
.dialog-footer {
  text-align: right;
  margin-bottom: -10px;
  margin-top: 30px;
}
.upload-btn {
  border-radius: 3px;
  border: 1px solid var(--tab-border-color);
  // color: rgba(0, 0, 0, 0.9);
}
.el-upload__tip {
  color: #8c8c8c;
}
:deep(.el-upload-list) {
  display: inline-flex;
  top: -50px;
  left: 120px;
  margin: 0;
  width: 300px;
  .el-upload-list__item {
    margin-bottom: 0;
  }
}

.item {
  margin-bottom: 10px;
  .label {
    vertical-align: top;
    display: inline-block;
  }
}
.item-tips {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
  margin-bottom: 10px;
  .row {
    margin-right: 30px;
  }
}
</style>
