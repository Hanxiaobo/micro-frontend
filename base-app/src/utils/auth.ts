import Cookies from 'js-cookie'

const TokenKey = 'token'
const RoleKey = 'roles'
const nameKey = 'username'
const nickNameKey = 'nickName'
const emailKey = 'email'
const avatarKey = 'avatar'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string | object) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeSession() {
  return Cookies.remove('JSESSIONID')
}

export function getRoles() {
  return Cookies.get(RoleKey) || '[]'
}

export function setRoles(role: string) {
  return Cookies.set(RoleKey, role)
}

export function removeRoles() {
  return Cookies.remove(RoleKey)
}

export function getNickName() {
  return Cookies.get(nickNameKey)
}
export function getEmail() {
  return Cookies.get(emailKey)
}
export function setNickName(name: string) {
  return Cookies.set(nickNameKey, name)
}
export function setEmail(email: string) {
  return Cookies.set(emailKey, email)
}
export function removeNickName() {
  return Cookies.remove(nickNameKey)
}
export function removeEmail() {
  return Cookies.remove(emailKey)
}

export function getName() {
  return Cookies.get(nameKey)
}

export function setName(name: string) {
  return Cookies.set(nameKey, name)
}

export function removeName() {
  return Cookies.remove(nameKey)
}

export function getAvatar() {
  return Cookies.get(avatarKey)
}

export function setAvatar(avatar: string) {
  return Cookies.set(avatarKey, avatar)
}

export function removeAvatar() {
  return Cookies.remove(avatarKey)
}

export function setUrl(url: string) {
  return Cookies.set('url', url)
}

export function getUrl() {
  return Cookies.get('url')
}

export function removeUrl() {
  return Cookies.remove('url')
}
