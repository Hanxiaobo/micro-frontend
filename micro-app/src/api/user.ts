import Http from '../utils/request'

const user_login = (data: any) => Http.post('/api/login', data, undefined)
const user_logout = (data: any) => Http.get('/api/logout', data, undefined)
const add_user = (data: any) => Http.post('/api/user', data, undefined)
const get_user_info = (id: string | undefined) => Http.get(`/api/user/${id}`, {}, undefined)
const update_user_info = (data: any) => Http.put(`/api/user/${data.id}`, {}, undefined)
const delete_user_info = (id: string | undefined) => Http.delete(`/api/user/${id}`, {}, undefined)
const get_user_list = (params?: any) => Http.get(`/api/users`, params, undefined)
const get_roles = (params?: any) => Http.get(`/api/roles`, params, undefined)
export {
  user_login,
  user_logout,
  add_user,
  get_user_info,
  update_user_info,
  delete_user_info,
  get_user_list,
  get_roles
}
