<template>
  <div>
    <el-table :data="data.rows" stripe style="width: 100%">
      <el-table-column prop="title" label="标题">
        <template #default="scope">
          <span v-if="isInLastThreeDays(scope.row.dateCreated)" class="news_icon"></span>
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status == 1" type="info">已读</el-tag>
          <el-tag v-if="scope.row.status == 0" type="warning">未读</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dateCreated" label="时间">
        <template #default="scope">
          {{ DateFormat(scope.row.dateCreated, '') }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容">
        <template #default="scope">
          <el-popover placement="top" :width="400" trigger="click" :content="scope.row.content">
            <template #reference>
              <el-button type="primary" plain @click="read(scope.row)">查看</el-button>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      style="margin-top: 10px; display: flex; justify-content: flex-end"
      :page-sizes="[20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue'
import { DateFormat, isInLastThreeDays } from '@/utils/util'
import { get_list_msg, msg_read } from '@/api/main'

const data = reactive({ rows: [], total: 0 })
const getList = (params: { page: number; pageSize: number }) => {
  get_list_msg(params).then((res: any) => {
    data.rows = res.data.rows
    data.total = res.data.total
  })
}
const currentPage = ref(1)
const pageSize = ref(10)
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getList({ page: currentPage.value, pageSize: val })
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getList({ page: val, pageSize: pageSize.value })
}
const read = (row: any) => {
  if (row.status === 0) {
    msg_read({ id: row.id })
  }
}
onBeforeMount(() => {
  getList({ page: 1, pageSize: 10 })
})
</script>

<style lang="scss" scoped>
.news_icon {
  display: inline-block;
  width: 20px;
  height: 11px;
  background: url('~@img/news_icon.png');
  background-repeat: round;
}
</style>
