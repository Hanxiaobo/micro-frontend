
import Http from '../utils/request'

const user_login = (data: any) => Http._get('', data)
const user_logout = (data: any) => Http._get('', data)

export {
  user_login,
  user_logout
}
