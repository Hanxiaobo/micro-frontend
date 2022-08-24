<template>
  <div>
    <el-row>
      <el-col :span="24" @click.stop="">
        <el-input
          v-model="searchVal"
          class="w-50 m-2"
          size="large"
          placeholder="请输入产品名称"
          :prefix-icon="Search"
        />
      </el-col>
    </el-row>
    <div class="appsContent">
      <div v-for="item in store.state.app.appList" :key="item.title" class="appsItem">
        <span class="title">{{ item.title }}</span>
        <ul>
          <template v-for="app in item.child" :key="app.id">
            <li v-show="!searchVal || app.name.indexOf(searchVal) > -1">
              <template v-if="app.clickAble === 1">
                <router-link v-if="app.target === 0" :to="app.url">
                  {{ app.name }}
                </router-link>
                <a v-if="app.target === 1" target="_blank" :href="app.url">{{ app.name }}</a>
                <I
                  class="star"
                  :class="{ isStar: app.isCollect }"
                  :size="16"
                  name="StarFilled"
                  @click.stop="toggleSc(app)"
                ></I>
              </template>
              <!-- <span v-else disabled class="disabledSpan" @click.stop>
                {{ app.name }}
              </span> -->
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import store from '@/store'
import { delete_sc, save_sc } from '@/api/main'

const searchVal = ref('')

const toggleSc = (app: any) => {
  if (app.isCollect) {
    delete_sc(app.id).then(() => {
      store.dispatch('app/getApps')
    })
  } else {
    save_sc(app.id).then(() => {
      store.dispatch('app/getApps')
    })
  }
}
// const apps = [
//   {
//     title: '探索分析',
//     children: [
//       {
//         name: '驾驶舱',
//         link: ''
//       },
//       {
//         name: '报表管理',
//         link: ''
//       },
//       {
//         name: '指标管理',
//         link: '/indicator',
//         isStar: true
//       }
//     ]
//   },
//   {
//     title: '数据工厂',
//     children: [
//       {
//         name: '数据集成',
//         link: ''
//       },
//       {
//         name: '实时计算',
//         link: ''
//       },
//       {
//         name: '数据开发',
//         link: ''
//       }
//     ]
//   },
//   {
//     title: '资产管理',
//     children: [
//       {
//         name: '存储资源',
//         link: '/dam'
//       }
//     ]
//   },
//   {
//     title: '数据资产',
//     children: [
//       {
//         name: '数据地图',
//         link: '/dam'
//       }
//     ]
//   },
//   {
//     title: '数据智能',
//     children: [
//       {
//         name: '模型监控',
//         link: '/dam'
//       }
//     ]
//   }
// ]
</script>

<style scoped lang="scss">
.appsContent {
  display: flex;
  justify-content: space-between;
  padding-bottom: 30px;
  .appsItem {
    min-width: 120px;
    li {
      position: relative;
      width: 130px;
      .star {
        position: absolute;
        right: 0;
      }
    }
  }
}
.title {
  font-size: 16px;
  margin: 10px 10px 0;
  display: inline-block;
  font-weight: 500;
  color: #262626;
  margin-bottom: 11px;
  margin-top: 20px;
}
ul,
li {
  list-style: none;
  cursor: pointer;
  font-weight: 400;
  color: #595959;
  font-size: 14px;
  margin: 5px;
  .disabledSpan {
    cursor: not-allowed;
    // border-bottom: 1px solid;
    color: #aeaeae;
  }
  :hover .disabledSpan {
    color: #aeaeae;
  }
  :hover {
    color: var(--el-color-primary);
  }
  :hover .star {
    display: inline;
  }
  .star {
    display: none;
    color: #cac7c7;
    margin-left: 5px;
    float: right;
    :hover {
      color: #cac7c7;
    }
  }
  .isStar {
    color: gold;
    display: inline;
    :hover {
      color: gold;
    }
  }
}
</style>
>
