<template>
  <div class="content">
    <div class="main">
      <div class="main-top">
        <div class="left">
          <div>
            <div class="title">12345</div>
            <div class="sub-title">34567</div>
            <div class="desp">56789</div>
          </div>
        </div>
        <div class="right"></div>
      </div>
      <div class="main-bottom">
        <el-card v-for="(item, index) in roleApps" :key="index" class="card-item" shadow="hover">
          <div v-if="item.activeRule === '/401'" @click="showTips(item)">
            <div class="item-title">{{ item.text }}</div>
            <div class="item-desp" v-html="item.desc"></div>
            <div class="item-body">
              <div class="item-body-left">
                <div class="arrow">
                  <I name="Right" :size="24"></I>
                </div>
              </div>
              <div class="item-body-right">
                <div class="item-bg" :style="{ 'background-image': `url(${item.bg})` }"></div>
              </div>
            </div>
          </div>
          <template v-else>
            <a v-if="item.type === 'openNewTab'" :href="item.entry" target="_blank">
              <div class="item-title">{{ item.text }}</div>
              <div class="item-desp" v-html="item.desc"></div>
              <div class="item-body">
                <div class="item-body-left">
                  <div class="arrow">
                    <I name="Right" :size="24"></I>
                  </div>
                </div>
                <div class="item-body-right">
                  <div class="item-bg" :style="{ 'background-image': `url(${item.bg})` }"></div>
                </div>
              </div>
            </a>
            <router-link v-else :to="item.activeRule">
              <div class="item-title">{{ item.text }}</div>
              <div class="item-desp" v-html="item.desc"></div>
              <div class="item-body">
                <div class="item-body-left">
                  <div class="arrow">
                    <I name="Right" :size="24"></I>
                  </div>
                </div>
                <div class="item-body-right">
                  <div class="item-bg" :style="{ 'background-image': `url(${item.bg})` }"></div>
                </div>
              </div>
            </router-link>
          </template>
        </el-card>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { showInMainApps } from '@/childNodes/apps'
import { computed } from 'vue'
import store from '@/store'
import { userApply } from '@/api/main'
import Footer from './footer.vue'
// import { emailadress } from '@/utils/constant'
const roles = store.state.app.menuList
const roleApps = computed(() => {
  showInMainApps.forEach((app) => {
    if (roles.every((r: { name: string }) => r.name !== app.activeRule)) {
      app.activeRule = '/401'
    }
    if (app.type === 'openNewTab') {
      const arr = roles.filter((r: { title: string }) => r.title === app.text)
      if (arr.length) {
        app.entry = arr[0].name
        app.activeRule = ''
      }
    }
  })
  return showInMainApps
})

const applyFn = async (action: string, name: string) => {
  const mapObj: any = {
    indicator: 'INDIC',
    report: 'REPORT'
  }

  if (action === 'confirm') {
    await userApply({
      permissionCode: 'general',
      systemCode: mapObj[name]
    })
    ElMessage({
      type: 'success',
      message: '发起申请成功！'
    })
  }
}
const showTips = (app: any) => {
  // <br />
  ElMessageBox.confirm(
    `您当前没有${app.text}系统的访问权限，<br />开通普通角色权限请点击
        一键申请，申请进度可在<br />【工单流程=>我的流程】页面查看` as string,
    '提示' as string,
    {
      type: 'info',
      showConfirmButton: true,
      confirmButtonText: '一键申请',
      showCancelButton: true,
      dangerouslyUseHTMLString: true,
      cancelButtonClass: 'cancelButtonClass',
      autofocus: false,
      callback: (action: string) => applyFn(action, app.name)
    } as object
  )
}
</script>

<style lang="scss" scoped>
.cancelButtonClass {
  padding: 9px 20px;
}
.content {
  position: relative;
  height: calc(100vh - 50px);
  min-height: 600px;
}
.main {
  width: 1200px;
  margin: 0 auto;
  .main-top {
    display: flex;
    height: calc(100vh - 430px);
    min-height: 200px;
    margin-bottom: 30px;
    max-height: 400px;
    .left {
      width: 392px;
      // padding-left: 24px;
      display: flex;
      align-items: center;
      // padding-bottom: 62px;
      .title {
        font-size: 26px;
        // margin-top: 72px;
        line-height: 38px;
        font-weight: bold;
        color: #00b85c;
        margin-left: -15px;
      }
      .sub-title {
        height: 24px;
        font-size: 20px;
        font-weight: 500;
        color: #262626;
        line-height: 24px;
        letter-spacing: 2px;
        margin-top: 8px;
      }
      .desp {
        padding-left: 12px;
        margin-top: 16px;
        height: 48px;
        font-size: 14px;
        font-weight: 400;
        color: #595959;
        line-height: 24px;
        border-left: 2px solid #00b85c;
      }
    }
    .right {
      background: url('~@img/main.png');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      flex: 1;
    }
  }
  .main-bottom {
    display: flex;
    justify-content: space-between;
  }
}
.card-item {
  width: 230px;
  height: 300px;
  padding: 24px;
  padding-bottom: 0;
  .item-title {
    font-size: 16px;
    font-weight: 500;
    color: #262626;
    line-height: 24px;
  }
  .item-desp {
    height: 136px;
    font-size: 12px;
    font-weight: 400;
    color: #595959;
    line-height: 20px;
    margin-top: 12px;
  }
  :hover {
    .item-body {
      .item-body-right {
        .item-bg {
          opacity: 1;
          transform: translateY(-15px);
        }
      }
    }
  }
  .item-body {
    height: 104px;
    display: flex;
    .item-body-left {
      .arrow {
        width: 40px;
        height: 40px;
        padding-top: 8px;
        margin-top: 38px;
        background: #00b85c;
        border-radius: 20px;
        color: white;
        text-align: center;
      }
    }
    .item-body-right {
      flex: 1;
      margin-right: -20px;
      .item-bg {
        background-position-x: 40px;
        background-size: contain;
        background-repeat: no-repeat;
        height: 150px;
        // transform: translateY(-20px);
        opacity: 0.5;
        transition-duration: 0.8s;
      }
    }
  }
  :deep(.el-card__body) {
    padding: 0;
  }
}
</style>
