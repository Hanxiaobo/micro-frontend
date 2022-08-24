import Http from '../utils/request'

// 欢迎语
const get_word = () => Http.get('', {}, null)
// 收藏
const get_app_list = () => Http.get('/', {}, null)
const delete_sc = (appId: any) => Http.delete(`/`, {}, null)
const save_sc = (appId: any) => Http.post(``, {}, null)
// 消息中心
const get_list_msg = (p: any) => Http.post(``, { ...p }, null)
const msg_read = (p: any) => Http.post(``, { ...p }, null)
// pv uv
const access_info = () => Http.get(``, {}, null)
// 上报pv、uv
// {
//   "userId":"1",
//   "userName":"www",
//   "system":"自助报表",
//   "url":"www.baidu.com",
//   "ip":"1.1.1.1"
// }
const access_log = (p: any) => Http.post(``, { ...p }, null)
// 获取待办
const getToDo = () => Http._get(``, {})
// 获取权限菜单
const getMenuList = (p: any) => Http.post(``, { ...p }, null)
// 获取角色信息  登陆接口里封装了

const userApply = (p: any) => Http.post(``, { ...p }, null)
export {
  get_word,
  get_app_list,
  delete_sc,
  save_sc,
  access_info,
  get_list_msg,
  msg_read,
  access_log,
  getToDo,
  getMenuList,
  userApply
}
