import Http from '../utils/request'
import store from '@/store'

const ToCDB = (str: string) => { // 全角转半角
  let tmp = ''
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === 12288) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 12256)
      continue
    }
    if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i))
    }
  }
  return tmp
}
const replaceVar = (str: string, tabId: string) => { // 替换sql变量
  const reg = /\$\{(.+?)\}/g
  let result: any = null
  do {
    result = reg.exec(str)
    const varList = store.state.app.variableList[tabId]
    if (result && varList) {
      const obj = varList.filter((item: any) => item.key === result[1])[0]
      str = str.replace(result[0], obj.value)
    }
  } while (result)
  return str
}

const gethiveTableMetaData = (data: any) => Http.post('', data, undefined)
const getQueryTree = (data: any) => Http.post('', data, undefined)
const getQueryTypeList = (data: any) => Http.post('', data, undefined)
const queryGroupList = (data: any) => Http.post('', data, undefined) // 用户拥有的分组
const groupSave = (data: any) => Http.post('', data, undefined)
const deleteGroup = (data: any) => Http.post('', data, undefined)
const deleteSql = (data: any) => Http.post('', data, undefined)
const queryHiveTableDDL = (data: any) => Http.post('', data, undefined)
const queryTableColumn = (data: any) => Http.post('', data, undefined)

const quertLog = (data: any) => Http.post('/', data, undefined)
const quertSqlList = (data: any) => Http.post('', data, undefined)
const saveSqlApi = (data: any) => Http.post('/', data, undefined) // sql保存编辑接口
const querydatasource = (data: any) => Http.post('', data, undefined) // 数据源类型
const queryDataCenter = (data: any) => Http.get('', data, undefined) // 机房
const queryEngine = (data: any) => Http.get('', data, undefined) // 查询引擎
const queryHistoryLog = (data: any) => Http.post('', data, undefined) // 运行历史
const batchExecute = (data: any) => Http.post('', { ...data, sqlContent: replaceVar(ToCDB(data.sqlContent), data.tabId) }, undefined) // 执行sql
const realTimeLog = (data: any) => Http.post('', data, undefined) // 实时轮询日志
const historyLogDetail = (data: any) => Http.post('', data, undefined) // 通过id获取已经执行过的sql日志
const queryResult = (data: any) => Http.post('', data, undefined) // 查询运行结果
const previewHiveData = (data: any) => Http.post('', data, undefined) // 数据预览，双击左侧表查询10条数据
const queryUserList = (data: any) => Http.get('', data, undefined)
const cancelJob = (data: any) => Http.post('', data, undefined) // kill终止任务
const getUploadTemporaryFileSuffix = () => Http.get('', {}, undefined)
const queryOdsOfflineTable = () => Http.get('', {}, undefined)
const checkTableName = (data: any) => Http.get('', data, undefined)

export {
  gethiveTableMetaData,
  getQueryTree,
  getQueryTypeList,
  queryGroupList,
  groupSave,
  deleteGroup,
  deleteSql,
  queryHiveTableDDL,
  saveSqlApi,
  quertLog,
  quertSqlList,
  querydatasource,
  queryDataCenter,
  queryEngine,
  queryHistoryLog,
  batchExecute,
  realTimeLog,
  historyLogDetail,
  queryResult,
  previewHiveData,
  queryTableColumn,
  queryUserList,
  cancelJob,
  getUploadTemporaryFileSuffix,
  queryOdsOfflineTable,
  checkTableName
}
