<template>
  <div v-loading="$attrs.loading" class="empty">
    <p v-show="!$attrs.loading" class="msg-tips"><slot>暂无数据</slot></p>
    <!-- <router-link to="/dam/dataMap">
      <p class="replay">去申请 <I class="icon-arr" name="ArrowRight" /></p>
    </router-link> -->
    <p v-show="!$attrs.loading" class="replay" @click="openNewTab">去申请 <I class="icon-arr" name="ArrowRight" /></p>
  </div>
</template>

<script>
export default {
  methods: {
    openNewTab() {
      window.open('/dam/dataMap')
    }
  }
}
</script>

<style lang="scss" scoped>
.empty {
  height: calc(100vh - 130px);
  padding-top: calc((100vh - 185px) / 2);
  text-align: center;
  .msg-tips {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #bfbfbf;
    line-height: 22px;
  }
  .replay {
    margin-top: 4px;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #00b85c;
    line-height: 20px;
    cursor: pointer;
  }
  .icon-arr {
    font-size: 12px;
    vertical-align: text-top;
  }
}
</style>
