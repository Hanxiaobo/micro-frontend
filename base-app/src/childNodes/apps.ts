import { envFn } from '@/utils/util'
const appsMap: any = {
  prod: { // 线上
    bolt: '',
    rawgraphs: ''
  },
  test: { // 测试
    bolt: '',
    rawgraphs: ''
  },
  uat: { // 开发
    bolt: '',
    rawgraphs: ''
  }
}
const ENV: string = envFn() // 获取当前环境
const pathMap = appsMap[ENV]
const apps: any[] = [ // qiankun、首页、导航，使用的应用信息
  {
    name: 'bolt',
    text: 'bolt',
    bg: require('@img/zzcx.png'),
    desc: '1111',
    // entry: pathMap.bolt,
    entry: 'http://localhost:3003/',
    showInMain: true,
    container: '#bolt',
    activeRule: '/bolt',
    children: ['/dataQuery'],
    type: 'qiankun'
  },
  {
    name: 'rawgraphs',
    text: '数据可视化',
    bg: '',
    desc: '',
    container: '#rawgraphs',
    // entry: pathMap.rawgraphs,
    entry: 'http://localhost:3000/',
    showInMain: false,
    activeRule: '/rawgraphs',
    // children: [],
    type: 'qiankun'
  }
]
const qiankunApps = apps.filter((app) => app.type === 'qiankun' && app.container !== '#free-app')
// 不开启沙箱
const freeApps = apps.filter((app) => app.container === '#free-app')
// 首页要显示介绍的应用
const showInMainApps = apps.filter((app) => app.showInMain)
const roleApps = apps.filter((app) => app.showInMenu)
export {
  qiankunApps,
  showInMainApps,
  roleApps,
  freeApps
}
export default apps
