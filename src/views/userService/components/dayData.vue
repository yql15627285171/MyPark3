<template>
  <div class="dayDataContainer">
    <div class="condition">
      <el-date-picker
        v-model="startDate"
        format="yyyy-MM-dd"
        type="date"
        size="medium"
        placeholder="开始日期"/>
      <span>至</span>
      <el-date-picker
        v-model="endDate"
        format="yyyy-MM-dd"
        type="date"
        size="medium"
        placeholder="结束日期"/>

      <el-button type="primary" size="medium" @click="getDayPageList">查询</el-button>

    </div>
    <div v-loading="loading" class="tableMessage">
      <el-table
        :data="message"
        :header-cell-style="tableHeadStyle"
        :cell-style="tableRowStyle"
        stripe
        border
        style="width: 100%">

        <el-table-column type="expand" width="30">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand" >
              <el-form-item v-for="(item,index) in messageName" v-if="index > 6" :key="index" :label="item.label" >
                <span>{{ props.row[item.id] }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          type="index"
          label="序号"
          width="50"/>

        <el-table-column
          v-for="(item,index) in messageName"
          v-if="index <= 6"
          :key="index"
          :label="item.label"
          :prop="item.id"/>

      </el-table>
      <div class="el-pagination">
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getDayPageList" />
      </div>
    </div>
  </div>
</template>

<script>
import { yearAndMonthAndDay } from '@/utils/time'
import Pagination from '@/components/Pagination'
import { getDayPageList } from '@/api/userService'

export default {
  name: 'DayData',
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
      startDate: new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30),
      endDate: new Date(),
      total: 0, // 表格数据的总数
      listQuery: {
        page: 1,
        limit: 20
      }, // 二次封装的分页器数据
      message: [],
      messageName: [
        {
          label: '栋/街/层',
          id: 'building'
        },
        {
          label: '房间信息',
          id: 'houseNo'
        },
        {
          label: '资产编号',
          id: 'deviceid'
        },
        {
          label: '表底示值_总',
          id: 'fp1'
        },
        {
          label: '日用电量',
          id: 'p'
        },
        {
          label: '冻结时间',
          id: 'settlementdate1'
        },
        {
          label: '用电时间',
          id: 'date'
        },
        {
          label: '抄表时间',
          id: 'readdata'
        },
        {
          label: '表底示值_尖',
          id: 'fp11'
        },
        {
          label: '日用电量_尖',
          id: 'p1'
        },
        {
          label: '表底示值_峰',
          id: 'fp12'
        },
        {
          label: '日用电量_峰',
          id: 'p2'
        },
        {
          label: '表底示值_平',
          id: 'fp13'
        },
        {
          label: '日用电量_平',
          id: 'p3'
        },
        {
          label: '表底示值_谷',
          id: 'fp14'
        },
        {
          label: '日用电量_谷',
          id: 'p4'
        }
      ]
    }
  },
  watch: {
    time: function() {
      this.getDayPageList()
    }
  },
  created() {
    this.getDayPageList()
  },

  methods: {
    // 设置表格
    tableHeadStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'background:#409EFF;color:#fff;text-align:center'
    },

    // 表格体
    tableRowStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center;padding:2px;'
    },

    // 查询日报表
    getDayPageList: function() {
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        DeviceId: this.assetsCode,
        dateBegin: yearAndMonthAndDay(new Date(this.startDate)),
        dateEnd: yearAndMonthAndDay(this.endDate),
        pageIndex: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.loading = true
      getDayPageList(params).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.message = result.page
          this.total = result.recordes
        } else {
          this.$message.error(result.msg)
        }
      }).catch(_ => {
        this.loading = false
      })
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

</style>
