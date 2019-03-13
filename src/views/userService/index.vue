<template>
  <div class="userServiceContainer">
    <div class="condition">
      <el-input
        v-model="queryName"
        placeholder="合同号/手机/房间/资产"
        prefix-icon="el-icon-search"
        size="medium"/>
      <el-select v-model="runStatus" clearable placeholder="阀控状态" size="medium">
        <el-option
          v-for="item in runStatusList"
          :key="item"
          :label="item"
          :value="item"/>
      </el-select>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="getMeterStateList">查询</el-button>
      <el-button type="primary" size="medium" icon="el-icon-plus" @click="chargeBtnCharge">充值</el-button>
      <el-button type="warning" size="medium" icon="el-icon-minus">退费</el-button>
    </div>
    <div v-loading="loading" class="tableMessage">
      <el-table
        :data="message"
        :header-cell-style="tableHeadStyle"
        :cell-style="tableRowStyle"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand" >
              <el-form-item
                v-for="(item,index) in messageName"
                v-if="index<=8"
                :label="item.label"
                :key="index">
                <span>{{ props.row[item.name] }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          type="selection"
          width="55"/>

        <el-table-column
          :index="sortIndex"
          align="center"
          label="序号"
          type="index"
          width="70"/>
        <el-table-column
          v-for="(item,index) in messageName"
          v-if="index > 8"
          :key="index"
          :prop="item.name"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable"
          align="center"/>

        <el-table-column
          align="left"
          label="操作"
          width="260">
          <template slot-scope="scope" >
            <el-button
              type="text"
              style="color: #409EFF;font-size: 13px"
              @click="readEMCurrentPara(scope.row)">
              <i class="el-icon-refresh"/>
              点抄
            </el-button>

            <el-button
              v-if="scope.row.RunStatus === '保电'"
              type="text"
              style="color: #df5000;font-size: 13px"
              @click="ctrlEMRelayStatus(scope.row,6)">
              <i class="el-icon-star-off"/>
              取保
            </el-button>
            <el-button
              v-else
              type="text"
              style="color: #409EFF;font-size: 13px"
              @click="ctrlEMRelayStatus(scope.row,5)">
              <i class="el-icon-star-on"/>
              保电
            </el-button>

            <el-button
              v-if="scope.row.RunStatus === '合闸'"
              type="text"
              style="color: #df5000;font-size: 13px"
              @click="ctrlEMRelayStatus(scope.row,1)">
              <i class="el-icon-close"/>
              拉闸
            </el-button>
            <el-button
              v-if="scope.row.RunStatus === '跳闸'"
              type="text"
              style="color: #55a532;font-size: 13px"
              @click="ctrlEMRelayStatus(scope.row,2)">
              <i class="el-icon-check"/>
              合闸
            </el-button>
            <el-button
              type="text"
              style="color: #E6A23C;font-size: 13px"
              @click="detailsBtnClick(scope.row)">
              <i class="el-icon-tickets"/>
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="el-pagination">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getMeterStateList" />
    </div>

    <el-dialog :visible.sync="dialogFormVisible" width="80%" title="详情">
      <el-tabs v-model="activeName">
        <el-tab-pane label="日用电信息" name="first">
          <day-data :assets-code="detailsAssetsCode" :time="clickDetailBtnTime"/>
        </el-tab-pane>
        <el-tab-pane label="月用电信息" name="second">
          <month-data :assets-code="detailsAssetsCode" :time="clickDetailBtnTime"/>
        </el-tab-pane>
        <el-tab-pane label="充值记录" name="third">
          <recharge-record :assets-code="detailsAssetsCode" :time="clickDetailBtnTime"/>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <charge-dialog
      :dialog-title="chargeDialogTitle"
      :assets-info="assetsInfo"
      :assets-code="assetsCode"
      :house-info="houseInfo"
      :charge-dialog-visible.sync="chargeDialogVisible"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import dayData from './components/dayData'
import monthData from './components/monthData'
import rechargeRecord from './components/rechargeRecord'
import chargeDialog from './components/chargeDialog'
import {
  getMeterStateList,
  readEMCurrentPara,
  ctrlEMRelayStatus } from '@/api/userService'
export default {
  name: 'UserService',
  components: {
    Pagination,
    monthData,
    dayData,
    rechargeRecord,
    chargeDialog
  },
  data() {
    return {
      queryName: '',
      runStatus: '', // 查询的运行状态
      runStatusList: ['合闸', '跳闸', '保电'], // 运行状态列表
      dialogFormVisible: false,
      activeName: 'first',
      message: [],
      loading: false,
      messageName: [
        {
          label: '资产型号',
          name: 'DeviceMode'
        },
        {
          label: '计费方案',
          name: 'schemeName'
        },
        {
          label: '账户余额',
          name: 'AccountAmount'
        },
        {
          label: '表内余额',
          name: 'DevAmount'
        },
        {
          label: '电价1',
          name: 'RatePrice1'
        },
        {
          label: '电价2',
          name: 'RatePrice2'
        },
        {
          label: '电价3',
          name: 'RatePrice3'
        },
        {
          label: '电价4',
          name: 'RatePrice4'
        },
        {
          label: '安装地址',
          name: 'installAddress'
        },
        {
          label: '资产名称',
          name: 'assetsName'
        },
        {
          label: '资产编号',
          name: 'assetsCode'
        },
        {
          label: '房间信息',
          name: 'buildHouse'
        },
        {
          label: '倍率',
          name: 'ct'
        },
        {
          label: '当前用量',
          name: 'CurrentPower'
        },
        {
          label: '剩余金额',
          name: 'RemainAmount'
        },
        {
          label: '余额状态',
          name: 'BalanceState',
          sortable: true,
          width: 120
        },
        {
          label: '阀控状态',
          name: 'RunStatus',
          sortable: true,
          width: 120
        },
        {
          label: '抄读时间',
          name: 'CurrentPowerTime',
          width: 180
        }
      ],
      total: 0, // 表格数据的总数
      listQuery: {
        page: 1,
        limit: 20
      }, // 二次封装的分页器数据
      detailsAssetsCode: '', // 详情页面的查询的条件
      selectionData: [], // 选中表格的信息
      chargeDialogVisible: false,
      chargeDialogTitle: '', // 充值退费界面的标题
      assetsInfo: '', // 充值退费的时候显示的资产信息
      assetsCode: '', // 充值的时候的资产号
      houseInfo: '',
      clickDetailBtnTime: '' // 每次点击详情的时间（确保每次点都或进行网络请求）
    }
  },
  created() {
    this.getMeterStateList()
  },
  methods: {
    // 设置表格
    tableHeadStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'background:#409EFF;color:#fff;text-align:center'
    },
    // 表格体
    tableRowStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'padding:3px'
    },
    // 排序
    sortIndex: function(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },

    // 选择对应的表格行
    handleSelectionChange: function(val) {
      this.selectionData = val
    },

    // 获取设备状态列表
    getMeterStateList: function() {
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        atillseach: this.queryName,
        runStatus: this.runStatus,
        pageIndex: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.loading = false
      getMeterStateList(params).then(result => {
        if (result.msg === 'success') {
          this.message = result.page
          this.total = result.recordes
        } else {
          this.$message.error(result.msg)
        }
      }).catch(_ => {
        this.loading = false
      })
    },

    // 点击点抄按钮
    readEMCurrentPara: function(data) {
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        DeviceId: data.assetsCode
      }

      this.loading = true
      readEMCurrentPara(params).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.$message.success('操作成功')
          this.getMeterStateList()
        } else {
          this.$message.error(result.msg)
        }
      }).catch(_ => {
        this.loading = false
        this.$message.error('超时')
      })
    },
    // 1拉闸 2合闸 3保电 4取保
    ctrlEMRelayStatus: function(data, index) {
      var operation = ''
      if (index === 1) {
        operation = '拉闸'
      } else if (index === 2) {
        operation = '合闸'
      } else if (index === 5) {
        operation = '保电'
      } else if (index === 6) {
        operation = '取保'
      }
      this.$confirm(`你确定要进行${operation}吗`, `提示`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          userId: window.sessionStorage.getItem('userId'),
          DeviceId: data.assetsCode,
          CtrlType: index
        }
        this.loading = true
        ctrlEMRelayStatus(params).then(result => {
          this.loading = false
          if (result.msg === 'success') {
            this.$message.success('操作成功')
            this.getMeterStateList()
          } else {
            this.$message.error(result.msg)
          }
        }).catch(_ => {
          this.loading = false
        })
      }).catch(() => {
        // 点击取消
      })
    },

    // 点击详情按钮
    detailsBtnClick: function(data) {
      this.detailsAssetsCode = data.assetsCode
      this.clickDetailBtnTime = new Date()
      this.dialogFormVisible = true
    },

    // 点击充值按钮
    chargeBtnCharge: function() {
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择唯一一个设备进行操作')
        return
      }
      this.houseInfo = this.selectionData[0].buildHouse
      this.assetsInfo = this.selectionData[0].installAddress
      this.chargeDialogTitle = '充值'
      this.assetsCode = this.selectionData[0].assetsCode
      this.chargeDialogVisible = true
    }

  }
}
</script>

<style scoped lang="scss">
.userServiceContainer{
  height: 100%;
  padding: 20px;
}
  .el-input{
    width: 300px;
  }

.condition{
  .el-input{
    width: 250px;
  }
  .el-button{
    margin-left: 20px;
  }
  .el-select{
    margin-left: 20px;
    width: 140px;
  }
}

.tableMessage{
  margin-top: 30px;
}

.el-pagination{
  text-align: center;
}
</style>
