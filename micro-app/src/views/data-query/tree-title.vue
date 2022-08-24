<template>
  <div class="tree-title">
    <p class="title">
      <slot></slot>
      <span v-if="!status" class="title-msg">{{ value }}</span>
      <el-input v-if="status" v-model="value" class="edit-input" />
      <template v-if="showEidt">
        <I v-show="!status" name="EditPen" :size="14" class="icon-tips edit-icon" @click.stop="editFun" />
        <span
          v-show="status"
          class="icon-tips con-icon"
          style="margin-top: 1px"
          @click.stop="changeFun"
        ><I
          name="Check"
        /></span>
      </template>
      <I v-if="showDele" name="Delete" :size="14" class="icon-tips del-icon" @click.stop="delFun" />
    </p>
  </div>
</template>
<script lang="ts">
import { computed, ref } from 'vue'
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    showEidt: {
      type: Boolean,
      default: false
    },
    showDele: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit-fold', 'del-fold'],
  setup(props: any, context: any) {
    const treeName = computed(() => props.name)
    const value = ref(props.name)
    const status = ref(false)
    const editFun = () => {
      status.value = true
    }
    const delFun = () => {
      context.emit('del-fold')
    }
    const changeFun = () => {
      status.value = false
      context.emit('edit-fold', value.value)
    }
    return {
      treeName,
      value,
      status,
      editFun,
      delFun,
      changeFun
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-title {
  width: 100%;
  padding: 0 12px;
}
.title {
  display: flex;
  .icon-tips {
    display: none;
  }
  &:hover {
    .icon-tips {
      display: inline-block;
    }
  }
}
.title-msg {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
:deep(.edit-input) {
  width: 80%;
  input {
    border: 1px solid #ccc;
    padding: 0;
    height: auto;
    line-height: initial;
    box-shadow: none;
    background-color: transparent;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #595959;
    :focus {
      background: transparent;
      outline: none;
    }
  }
}
.edit-icon {
  display: inline-block;
  // width: 12px;
  // height: 12px;
  // background: url('../../assets/img/icon_rename.png') no-repeat;
  // background-size: contain;
  margin-top: 2px;
  // color: #9f9c9c;
}
.edit-icon:hover {
  color: #01b85c;
}
.del-icon {
  display: inline-block;
  // width: 12px;
  // height: 12px;
  // background: url('../../assets/img/icon_del.png') no-repeat;
  // background-size: contain;
  margin-left: 4px;
  margin-top: 2px;
}
.del-icon:hover {
  color: #d73c3c;
}
// .con-icon {
//   display: inline-block;
//   width: 16px;
//   height: 16px;
//   background: url('../../assets/img/close.png') no-repeat;
//   background-size: contain;
// }
</style>
