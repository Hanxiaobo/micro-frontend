

🎉 基于 Vue 3.0 + Vue-Router 4.0 + Vuex 4.0 + element-plus + typescript 的后台管理系统

# 安装依赖
npm install


# 启动服务
npm run dev
```

## 其它

```bash
# eslint代码格式检查
npm run lint:js

# stylelint代码样式检查
npm run lint:css
```



```
fontend
├─ .browserslistrc
├─ .editorconfig
├─ .env.development
├─ .env.production
├─ .eslintignore
├─ .eslintrc.js
├─ .gitignore
├─ .husky
│  ├─ .gitignore
│  ├─ commit-msg
│  ├─ pre-commit
│  └─ pre-push
├─ .prettierignore
├─ .prettierrc
├─ .stylelintignore
├─ .stylelintrc.js
├─ .vscode
│  ├─ extensions.json
│  └─ settings.json
├─ commitlint.config.js
├─ docker
│  └─ templates
│     └─ default.conf.template   
├─ jest.config.js
├─ LICENSE
├─ mock
│  ├─ index.js
│  ├─ mock-server.js
│  ├─ modules
│  │  └─ user.js
│  └─ utils.js
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ favicon.ico
│  ├─ img
│  │  ├─ 401.gif
│  │  ├─ 404.png
│  │  ├─ 404_cloud.png
│  │  └─ logo.png
│  └─ index.html
├─ README.md
├─ src
│  ├─ @types
│  │  ├─ index.d.ts
│  │  └─ store.d.ts
│  ├─ api
│  │  ├─ main.ts
│  │  └─ user.ts
│  ├─ App.vue
│  ├─ assets
│  │  ├─ flowFonts    我的流程<myflow-h5>应用使用的字体文件
│  │  │  ├─ iconfont.css
│  │  │  ├─ iconfont.js
│  │  │  ├─ iconfont.json
│  │  │  ├─ iconfont.ttf
│  │  │  ├─ iconfont.woff
│  │  │  └─ iconfont.woff2
│  │  ├─ fonts    其他应用使用的iconfont图标
│  │  │  ├─ element-icons.535877f5.woff
│  │  │  ├─ element-icons.732389de.ttf
│  │  │  ├─ elementuifont.css
│  │  │  ├─ iconfont.css
│  │  │  ├─ iconfont.js
│  │  │  ├─ iconfont.json
│  │  │  ├─ iconfont.ttf
│  │  │  ├─ iconfont.woff
│  │  │  └─ iconfont.woff2
│  │  └─ img
│  │     ├─ 401.gif
│  │     ├─ 404.png
│  │     ├─ 404_cloud.png
│  │     ├─ bbgl.png
│  │     ├─ dark_logo.png
│  │     ├─ dark_logo1.png
│  │     ├─ ddyw.png
│  │     ├─ jtzb.png
│  │     ├─ line.png
│  │     ├─ logo.png
│  │     ├─ logo1.png
│  │     ├─ main.png
│  │     ├─ main_1.png
│  │     ├─ news_icon.png
│  │     ├─ photo.png
│  │     ├─ sjdt.png
│  │     ├─ sjjc.png
│  │     ├─ sjkf.png
│  │     ├─ sjzl.png
│  │     ├─ sytj_bg.png
│  │     ├─ tsfx1.png
│  │     ├─ tsfx2.png
│  │     ├─ tsfx3.png
│  │     ├─ tsfx4.png
│  │     ├─ tsfx5.png
│  │     ├─ tsfx6.png
│  │     ├─ tsfx7.png
│  │     ├─ wdlc.png
│  │     ├─ zbgl.png
│  │     ├─ zhibiao.png
│  │     └─ zzcx.png
│  ├─ childNodes
│  │  ├─ apps.ts   子应用的配置文件
│  │  ├─ free.ts   没用
│  │  └─ index.ts  注册子应用，定义全局状态
│  ├─ components   全局组件，暂时没用
│  │  ├─ ShowDirective
│  │  │  ├─ components
│  │  │  │  ├─ Copy.vue
│  │  │  │  ├─ Debounce.vue
│  │  │  │  ├─ Draggable.vue
│  │  │  │  ├─ LazyLoad.vue
│  │  │  │  ├─ Permission.vue
│  │  │  │  ├─ Throttle.vue
│  │  │  │  └─ WaterMarker.vue
│  │  │  └─ index.vue
│  │  └─ SkCas   没用
│  │     └─ index.vue
│  ├─ config
│  │  ├─ env.dev.js
│  │  └─ env.prod.js
│  ├─ directive  暂时没用
│  │  ├─ copy.ts
│  │  ├─ debounce.ts
│  │  ├─ draggable.ts
│  │  ├─ index.ts
│  │  ├─ lazyLoad.ts
│  │  ├─ permission.ts
│  │  ├─ throttle.ts
│  │  └─ waterMarker.ts
│  ├─ layout
│  │  ├─ components
│  │  │  ├─ AppMain.vue
│  │  │  ├─ Navbar   顶部导航栏
│  │  │  │  ├─ Applist.vue
│  │  │  │  ├─ Breadcrumb.vue
│  │  │  │  ├─ Hamburger.vue
│  │  │  │  ├─ index.vue
│  │  │  │  └─ Screenfull.vue
│  │  │  ├─ Sidebar
│  │  │  │  ├─ Hamburger.vue
│  │  │  │  ├─ index.vue
│  │  │  │  └─ SidebarItem.vue
│  │  │  └─ TagsView
│  │  │     ├─ index.vue
│  │  │     └─ ScrollPane.vue
│  │  └─ index.vue
│  ├─ main.ts
│  ├─ permission.ts  路由钩子，登录鉴权pvuv上报等逻辑
│  ├─ router
│  │  └─ index.ts
│  ├─ settings.ts
│  ├─ store
│  │  ├─ index.ts
│  │  └─ modules
│  │     ├─ app.ts  系统状态
│  │     ├─ permission.ts  暂时没用
│  │     ├─ tagsView.ts  暂时没用
│  │     └─ user.ts  登录和用户信息
│  ├─ styles
│  │  ├─ atomic.scss
│  │  ├─ element-ui.scss
│  │  ├─ index.scss
│  │  ├─ sidebar.scss
│  │  ├─ themes.css  主题样式
│  │  ├─ transition.scss
│  │  └─ variables.scss
│  ├─ utils
│  │  ├─ auth.ts
│  │  ├─ constant.ts
│  │  ├─ formExtend.ts
│  │  ├─ get-page-title.ts
│  │  ├─ request.ts   请求的封装
│  │  ├─ util.ts
│  │  └─ validate.ts
│  └─ views
│     ├─ error-page  错误页面
│     │  ├─ 401.vue
│     │  └─ 404.vue
│     ├─ login  没用
│     │  └─ index.vue
│     ├─ main   首页
│     │  ├─ footer.vue
│     │  ├─ index.vue
│     │  └─ moreNews.vue
│     ├─ menu   没用
│     │  ├─ index.vue
│     │  ├─ menu10.vue
│     │  ├─ menu11.vue
│     │  ├─ menu12.vue
│     │  └─ menu2.vue
│     ├─ myflow   我的流程，挂载页面，不开启沙箱的应用都可以在这里挂载
│     │  └─ index.vue
│     ├─ personal-center   没用
│     │  └─ index.vue
│     ├─ setting  没用
│     │  ├─ components
│     │  │  └─ User.vue
│     │  ├─ index.vue
│     │  └─ setting.vue
│     └─ star   没用
│        └─ index.vue
├─ tests
│  └─ unit
│     └─ utils
│        └─ validate.spec.ts
├─ tsconfig.json
└─ vue.config.js

```
