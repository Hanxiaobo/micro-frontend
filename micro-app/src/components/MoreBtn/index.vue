<template>
  <div>
    <slot name="btn1" />
    <slot name="btn2" />
    <el-dropdown v-if="Object.keys(mySlots).length > 2" class="more-btn" :popper-options="{ teleported: false }">
      <span class="el-dropdown-link"><I name="MoreFilled"></I> </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="btn in Object.keys(mySlots).slice(2, Object.keys(mySlots).length)" :key="btn">
            <slot :name="btn" />
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'
const mySlots = useSlots()
</script>

<style scoped lang="scss">
.more-btn {
  padding: 3px;
  color: var(--el-button-text-color);
  cursor: pointer;
  margin-left: 9px;
  transform: rotate(90deg);
}
</style>
