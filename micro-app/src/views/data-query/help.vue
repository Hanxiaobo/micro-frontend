<template>
  <div class="help-doc">
    <div class="section">
      <div class="title">一、快捷键说明</div>
      <p>运行: Ctrl + Enter</p>
      <p>格式化：F10</p>
      <p>保存：Ctrl + S</p>
      <p>全屏：F11</p>
    </div>
    <div class="section">
      <div class="title">二、使用说明</div>
      <p>1.双击左侧表可快速预览数据</p>
      <p>2.智能路由无需选择数据源或执行引擎</p>
      <p>3.为了加速查询采用了二级加速：Doris 加速，Presto 加速</p>
      <p>
        4.查询结果默认限制 2W 条，如果超过 2W
        条（最大20W）会自动发起审批流程，在右上角头像“我的流程”中查看进度。审批完成后可在运行历史查看和下载
      </p>
      <p>5.打开多个查询 Tab 可右键执行一键关闭操作</p>
    </div>
    <div class="section">
      <div class="title">三、加速说明</div>
      <p>1.加速查询优先级为：Doris(已同步表) > Presto (语法支持) > Spark</p>
      <p>
        2.Doris 集群的数据是从 Hive 大数据集群同步，极小概率会出现数据不一致的情况(会校验数据)，这时以 Presto 引擎或
        Spark 引擎数据为准
      </p>
      <p>3.Presto 集群用的数据和 Spark 引擎同源，不存在数据一致性问题，个别语法或函数可能和 Spark 有差异</p>
      <p>4.超大表的查询会使用 hive 引擎查询</p>
    </div>
    <div class="section">
      <div class="title">四、智能路由说明</div>
      <p>
        如果不指定查询引擎，默认会采用如下路由规则：Doris(已同步表) > Presto (语法支持) > Spark
      </p>
      <p> 例如: </p>
      <p>select * from db.table</p>
      高级用法:
      <p>1.指定查询引擎，只需在SQL上方加"--[查询引擎名称]"</p>
      <p>例如:</p>
      <p>--spark</p>
      <p>select * from db.table</p>
      <p>
        2.指定查询引擎及大数据集群，只需在SQL上方加"--[查询引擎名称] [大数据集群名称]"
      </p>
      <p>例如: </p>
      <p>--spark safe_lycc</p>
      <p>select * from db.table</p>
      <p>
        查询引擎名称: spark, spk, presto, pst, hive, doris, mysql 大数据集群名称: safe_lycc|safelycc|sfly
        (一般业务集群), bjmd (风控建模及策略集群) doris集群名称:dw_faster_doris(自助查询加速集群),
        report_doris(报表集群), rta_doris(广告投放集群）
      </p>
    </div>
    <div class="section">
      <div class="title">五、附录</div>
      <p>各引擎对比分析：</p>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column :class-name="'vdoing'" prop="vdoing" width="80" label="" />
        <el-table-column prop="Doris" label="Doris" />
        <el-table-column prop="Presto" label="Presto" />
        <el-table-column prop="Spark" label="Spark" />
        <el-table-column prop="Hive" label="Hive" />
      </el-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
const tableData = [
  {
    vdoing: 'SQL 支持',
    Doris: 'MySQL',
    Presto: 'ANSI SQL',
    Spark: 'Spark SQL',
    Hive: 'HiveQL'
  },
  {
    vdoing: '使用场景',
    Doris: '快速数据查询探索以及复杂数据分析，秒级响应',
    Presto: '交互式查询和快速数据探索，针对延迟进行了优化',
    Spark: '通用，通常用于数据查询和转换',
    Hive: '大型数据聚合，针对查询吞吐量进行了优化'
  },
  {
    vdoing: '处理过程',
    Doris: '列式存储，向量化加速，智能索引和优化，最大化查询性能',
    Presto: '在内存中执行查询，在stages之间通过网络流水线化，从而避免不必要的 I/O',
    Spark: '优化的有向无环图 (DAG) 执行引擎，并主动将数据缓存在内存中',
    Hive: '使用 Apache Tez 或 MapReduce 计算框架进行批处理'
  }
]
</script>
<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #262626;
  line-height: 24px;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}
p {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--el-text-color-regular);
  line-height: 22px;
}
.section {
  margin-bottom: 12px;
}
:deep(.vdoing) {
  background-color: var(--el-table-c-bg-color);
  font-weight: bold;
  color: var(--el-table-header-text-color);
}
.help-doc {
  max-height: calc(95vh - 216px);
  overflow: auto;
}
</style>
