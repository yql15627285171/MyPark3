<template>
  <div class="oprtRecordContainer">
    <div class="condition">
      <el-date-picker
        v-model="dateBegin"
        format="yyyy-MM-dd"
        type="date"
        size="medium"
        placeholder="开始日期"/>
      <span>至</span>
      <el-date-picker
        v-model="dateEnd"
        format="yyyy-MM-dd"
        type="date"
        size="medium"
        placeholder="结束日期"/>

      <el-button type="primary" size="medium" @click="getMeterOperLogList">查询</el-button>

    </div>
    <div v-loading="loading" class="tableMessage">
      <el-table
        :data="message"
        :header-cell-style="tableHeadStyle"
        :cell-style="tableRowStyle"
        stripe
        border
        style="width: 100%">

        <el-table-column
          :index="sortIndex"
          type="index"
          label="序号"
          width="70"/>

        <el-table-column
          label="操作账户"
          prop="username"/>

        <el-table-column
          label="资产编号"
          prop="deviceid"/>

        <el-table-column
          label="事件"
          prop="ctrltype"/>

        <el-table-column
          label="时间"
          prop="createDate"/>

      </el-table>
      <div class="el-pagination">
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getMeterOperLogList" />
      </div>
    </div>
  </div>
</template>

<script>
import { getMeterOperLogList } from '@/api/operationRecord'
import { yearAndMonthAndDay } from '@/utils/time'
import Pagination from '@/components/Pagination'
export default {
  name: 'OprtRecord',
  components: { Pagination },
  data() {
    return {
      loading: false,
      dateBegin: new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 3),
      dateEnd: new Date(),
      total: 0, // 表格数据的总数
      listQuery: {
        page: 1,
        limit: 20
      }, // 二次封装的分页器数据
      message: []
    }
  },
  created() {
    this.getMeterOperLogList()
  },
  methods: {
    // 设置表格
    tableHeadStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'background:#409EFF;color:#fff;text-align:center'
    },
    // 表格体
    tableRowStyle: function({ row, column, rowIndex, columnIndex }) {
      var style = 'text-align:center;padding:2px;'
      if (columnIndex === 6 && parseFloat(row.p) < 0) {
        style += 'color:red'
      }
      return style
    },
    // 排序
    sortIndex: function(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },

    getMeterOperLogList: function() {
      var params = {
        communityId: window.sessionStorage.getItem('communityId'),
        dateBegin: yearAndMonthAndDay(new Date(this.dateBegin)),
        dateEnd: yearAndMonthAndDay(this.dateEnd),
        pageIndex: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.loading = true
      getMeterOperLogList(params).then(result => {
        this.loading = false
        console.log(result)
        if (result.msg === 'success') {
          this.total = result.recordes
          this.message = result.page
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .tableMessage{
    margin-top: 20px;
  }
  .el-pagination{
    text-align: center;
  }
</style>
