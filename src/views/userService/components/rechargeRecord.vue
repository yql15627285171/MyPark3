<template>
  <div class="rechargeRecordContainer">
    <div class="condition">
      <el-date-picker
        v-model="startDate"
        type="date"
        size="medium"
        placeholder="开始日期"/>
      <span>至</span>
      <el-date-picker
        v-model="endDate"
        type="date"
        size="medium"
        placeholder="结束日期"/>
      <el-button type="primary" size="medium" @click="getRechargeRecord">查询</el-button>
      <el-button type="primary" size="medium" @click="export2Excel">导出表格</el-button>
    </div>
    <!--<section ref="print">-->
    <div v-loading="loading" class="tableMessage">
      <el-table
        :data="message"
        :header-cell-style="tableHeadStyle"
        :cell-style="tableRowStyle"
        width="100%"
        stripe
        border
        style="width: 100%">

        <el-table-column type="expand" width="30">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item
                v-for="(item,index) in messageName"
                v-if="index > 7"
                :label="item.label"
                :key="index" >
                <span>{{ props.row[item.id] }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          :index="sortIndex"
          type="index"
          label="序号"
          width="50"/>

        <el-table-column
          v-for="(item,index) in messageName"
          v-if="index <= 7"
          :key="index"
          :label="item.label"
          :prop="item.id"
          :width="item.width"/>

      </el-table>
    </div>
    <div style="text-align:center;font-size:16px;margin-top:20px">
      <span style="margin-right:60px">实收：{{ totalMoney.ssje }}元</span>
      <span style="margin-right:60px">充值：{{ totalMoney.czje }}元</span>
      <span style="margin-right:60px">退费：{{ totalMoney.tfje }}元</span>
      <span style="margin-right:20px">补助：{{ totalMoney.bzje }}元</span>
    </div>
    <!--</section>-->

    <div class="el-pagination">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRechargeRecord" />
    </div>
  </div>
</template>

<script>
import { yearAndMonthAndDay } from '@/utils/time'
import Pagination from '@/components/Pagination'
import { getRechargeRecord } from '@/api/userService'
export default {
  name: 'RechargeRecord',
  components: {
    Pagination
  },
  props: {
    assetsCode: {
      type: String,
      default: ''
    },
    time: {
      type: Date,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      startDate: new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
      endDate: new Date(),
      message: [],
      messageName: [
        {
          label: '栋/街/层',
          id: 'building'
        },
        {
          label: '房间号',
          id: 'houseNo'
        },
        {
          label: '交易类型',
          id: 'transactiontype'
        },
        {
          label: '交易金额',
          id: 'transactionamount'
        },
        {
          label: '交易路径',
          id: 'transactionmode'
        },
        {
          label: '交易方式',
          id: 'transactionmethod'
        },
        {
          label: '交易时间',
          id: 'transactiontime',
          width: 180
        },
        {
          label: '资产编号',
          id: 'deviceid',
          width: 150
        },
        {
          label: '交易单号',
          id: 'ordercode'
        },
        {
          label: '第三方订单号',
          id: 'otherTransactionorder'
        }
      ],
      totalMoney: {
        tfje: '',
        czje: '',
        ssje: '',
        bzje: ''
      }, // 汇总金额
      total: 0, // 表格数据的总数
      listQuery: {
        page: 1,
        limit: 20
      } // 二次封装的分页器数据
    }
  },
  watch: {
    time: function() {
      this.getRechargeRecord()
    }
  },

  created() {
    this.getRechargeRecord()
  },

  methods: {
    // 设置表格
    tableHeadStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'background:#409EFF;color:#fff;text-align:center;'
    },

    // 表格体
    tableRowStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center;padding:2px;'
    },

    // 排序
    sortIndex: function(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },

    getRechargeRecord: function() {
      this.message = []
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        DeviceId: this.assetsCode,
        dateBegin: yearAndMonthAndDay(new Date(this.startDate)),
        dateEnd: yearAndMonthAndDay(this.endDate),
        pageIndex: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.loading = true
      getRechargeRecord(params).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.message = result.page
          this.total = result.recordes
          if (result.total.length !== 0) {
            this.totalMoney = result.total[0]
            if (this.totalMoney.tfje == null) {
              this.totalMoney.tfje = 0
            }
            if (this.totalMoney.bzje == null) {
              this.totalMoney.bzje = 0
            }
          } else {
            this.totalMoney.czje = 0
            this.totalMoney.ssje = 0
            this.totalMoney.tfje = 0
            this.totalMoney.bzje = 0
          }
        } else {
          this.$message.error(result.msg)
        }
      }).catch(_ => {
        this.loading = false
      })
    },

    // 导出表格
    export2Excel: function() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        const tHeader = [
          '栋/街/层',
          '房间号',
          '交易类型',
          '交易金额',
          '交易路径',
          '交易方式',
          '交易时间',
          '资产编号',
          '交易单号',
          '第三方订单号']
        const filterVal = [
          'building',
          'houseNo',
          'transactiontype',
          'transactionamount',
          'transactionmode',
          'transactionmethod',
          'transactiontime',
          'deviceid',
          'ordercode',
          'otherTransactionorder']
        const list = this.message
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '财务表格')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }

  }
}
</script>

<style scoped lang="scss">
  .condition{
    .el-button{
      margin-left: 10px;
    }
    .el-input{
      width: 200px;
    }
  }

  .tableMessage{
    margin-top: 20px;
  }

  .el-pagination{
    text-align: center;
  }

  /*@media print {*/
    /*#printMessage{*/
      /*width: 100%!important;*/
    /*}*/
  /*}*/

</style>
