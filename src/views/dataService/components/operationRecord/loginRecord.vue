<template>
  <div class="loginRecordContainer">
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

      <el-button type="primary" size="medium" @click="getLoginList">查询</el-button>

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
          width="50"/>

        <el-table-column
          label="登录账户"
          prop="loginName"/>

        <el-table-column
          label="登录ip"
          prop="ipaddr"/>

        <el-table-column
          label="登录地址"
          prop="loginLocation"/>

        <el-table-column
          label="登录时间"
          prop="loginTime"/>

      </el-table>
      <div class="el-pagination">
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getLoginList" />
      </div>
    </div>
  </div>
</template>

<script>
import { getLoginList } from '@/api/operationRecord'
import { yearAndMonthAndDay } from '@/utils/time'
import Pagination from '@/components/Pagination'
export default {
  name: 'LoginRecord',
  components: { Pagination },
  data() {
    return {
      loading: false,
      dateBegin: new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30),
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
    this.getLoginList()
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

    getLoginList: function() {
      var params = {
        username: window.sessionStorage.getItem('username'),
        dateBegin: yearAndMonthAndDay(new Date(this.dateBegin)),
        dateEnd: yearAndMonthAndDay(this.dateEnd),
        pageIndex: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.loading = true
      getLoginList(params).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.total = result.recordes
          this.message = result.page
        }
      }).catch(_ => {
        this.loading = false
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
