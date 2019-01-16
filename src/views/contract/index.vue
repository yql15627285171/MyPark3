<template>
  <div class="contractContainer">
    <div class="condition">
      <el-input
        v-model="queryName"
        placeholder="合同/乙方名/联系人/手机"
        prefix-icon="el-icon-search"
        size="medium"/>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button type="primary" size="medium" icon="el-icon-plus" @click="addBtnClick">新增</el-button>
      <!--<el-button type="primary" size="medium" icon="el-icon-edit">修改</el-button>-->
      <el-button type="primary" size="medium" icon="el-icon-refresh">技术参数变更</el-button>
    </div>
    <div v-loading="loading" class="tableMessage">
      <el-table
        :data="message"
        :header-cell-style="tableHeadStyle"
        :cell-style="tableRowStyle"
        stripe
        border
        style="width: 100%">

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand" >
              <el-form-item
                v-for="(item,index) in messageName"
                v-if="index<=3"
                :label="item.label"
                :key="index">
                <span>{{ props.row[item.name] }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          type="selection"
          width="55"/>
        <el-table-column
          label="序号"
          type="index"
          width="50"/>

        <el-table-column
          v-for="(item,index) in messageName"
          v-if="index>3"
          :key="index"
          :prop="item.name"
          :label="item.label"
          :width="item.width"
          align="center"/>

        <el-table-column
          align="left"
          label="操作"
          width="200">
          <template slot-scope="scope" >
            <el-button
              v-if="scope.row.start == '启用'"
              type="text"
              size="small"
              style="color: #409EFF">
              <i class="el-icon-edit"/>
              续签
            </el-button>
            <el-button
              v-if="scope.row.start == '未启用'"
              type="text"
              size="small"
              style="color: #409EFF"
              @click="updataStart(scope.row)">
              <i class="el-icon-edit"/>
              启用
            </el-button>

            <el-button
              type="text"
              size="small"
              style="color: #55a532"
              @click="updateBtnClick(scope.row)">
              <i class="el-icon-edit"/>
              修改
            </el-button>

            <el-button
              v-if="scope.row.start !== '启用'"
              type="text"
              size="small"
              style="color: #df5000"
              @click="deletePropertyLeasingContract(scope.row)">
              <i class="el-icon-delete"/>
              <span>删除</span>
            </el-button>

            <el-button
              v-if="scope.row.start === '启用'"
              type="text"
              size="small"
              style="color: #df5000">
              <i class="el-icon-delete"/>
              <span>终止</span>
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="el-pagination">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>

    <!--新增合同-->
    <el-dialog :visible.sync="addDialogVisible" :title="addTitle">
      <el-steps :active="active" finish-status="success">
        <el-step title="步骤1" description="制定甲方信息"/>
        <el-step title="步骤2" description="制定乙方信息"/>
        <el-step title="步骤3" description="制定技术方案"/>
      </el-steps>
      <first-step v-show="active == 0" :data-form="dataForm1"/>
      <second-step v-show="active == 1" :data-form="dataForm2"/>
      <third-step v-show="active == 2" :data-form="dataForm3"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="lastStep">上一步</el-button>
        <el-button v-if="active!==2" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-else type="primary" @click="saveRentlInt">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import FirstStep from './components/firstStep'
import SecondStep from './components/secondStep'
import ThirdStep from './components/thirdStep'
import {
  getPropertyLeasingContract,
  savePropertyLeasingContract,
  savePLCYi,
  deletePropertyLeasingContract,
  saveRentlInt,
  updataStart } from '@/api/contract'
import { getContractStatus } from '@/utils/meaning'
import { yearAndMonthAndDay } from '@/utils/time'
export default {
  name: 'Contract',
  components: { SecondStep, FirstStep, Pagination, ThirdStep },
  data() {
    return {
      loading: false,
      queryName: '',
      addDialogVisible: false,
      addTitle: '添加/修改 甲方模板',
      active: 0, // 活跃的步骤条
      message: [],
      messageName: [
        {
          label: '合同编码',
          name: 'contractNumber'
        },
        {
          label: '租赁面积(㎡)',
          name: 'targetArea'
        },
        {
          label: '起始日期',
          name: 'startTime'
        },
        {
          label: '截止日期',
          name: 'endTime'
        },
        {
          label: '合同名称',
          name: 'contractName'
        },
        {
          label: '房间信息',
          name: 'houseInfo'
        },
        {
          label: '客户名称',
          name: 'corporateNameYi'
        },
        {
          label: '联系人',
          name: 'nameYi'
        },
        {
          label: '联系方式',
          name: 'contactInformationYi'
        },
        {
          label: '有效天数',
          name: 'reTime'
        },
        {
          label: '合同状态',
          name: 'start'
        }

      ],
      total: 0, // 表格数据的总数
      listQuery: {
        page: 1,
        limit: 20
      }, // 二次封装的分页器数据
      dataForm1: {
        id: 0,
        communityId: parseInt(window.sessionStorage.getItem('communityId')),
        contractName: '', // 方案名
        corporateNameJa: '', // 公司名
        corporateRepresentativeJa: '', // 法人代表
        dutyParagraphJa: '', // 税号
        unitAddressJa: '', // 单位地址
        phoneNumberJa: '', // 电话号码
        openingBankJa: '', // 开户行
        receivingAccountJa: '', // 收款账户
        nameJa: '', // 联系人
        contactInformationJa: '', // 联系方式
        contactAddressJa: '', // 联系地址
        mailJa: '', // 联系电子邮箱
        payee: '', // 收款人
        clause: '', // 条款
        starte: ''
      }, // 甲方信息
      dataForm2: {
        id: '',
        typeYi: '个人', // 是个人还是公司
        communityId: parseInt(window.sessionStorage.getItem('communityId')),
        corporateNameYi: '', // 公司名
        corporateRepresentativeYi: '', // 法人代表
        dutyParagraphYi: '', // 税号
        unitAddressYi: '', // 单位地址
        phoneNumberYi: '', // 电话号码
        nameYi: '', // 联系人
        contactInformationYi: '', // 联系方式
        contactAddressYi: '', // 联系地址
        mailYi: '' // 联系电子邮箱
      }, // 乙方
      dataForm3: {
        id: '', // 合同id
        startAndEndtime: [], // 起止时间
        rentInfo: [
          {
            house: '', // 房间
            rentMoney: '', // 月租金
            formYears: '', // 递增基时
            circle: '', // 递增周期
            rate: ''// 递增比例
          }
        ],
        chargingInfo: [
          {
            chargingPrograme: '',
            deviceNums: [],
            chargingPlan: ''
          }
        ]
      } // 技术方案信息
    }
  },

  watch: {
    addDialogVisible: function(newValue) {
      if (newValue === false) {
        this.getList()
      }
    },
    active: function(newValue) {
      if (newValue === 0) {
        this.addTitle = '添加/修改 甲方模板'
      } else if (newValue === 1) {
        this.addTitle = '添加/修改 乙方模板'
      } else if (newValue === 2) {
        this.addTitle = '制定技术方案'
      }
    }
  },
  created() {
    this.getList()
  },

  methods: {
    // 设置表格
    tableHeadStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'background:#409EFF;color:#fff;text-align:center'
    },
    // 表格体
    tableRowStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'padding:2px;;text-align:center'
    },

    addBtnClick: function() {
      this.active = 0
      for (const key in this.dataForm1) {
        this.dataForm1[key] = ''
      }
      this.dataForm1.id = 0
      this.dataForm1.communityId = window.sessionStorage.getItem('communityId')

      for (const key in this.dataForm2) {
        this.dataForm2[key] = ''
      }
      this.dataForm2.id = 0
      this.dataForm2.communityId = window.sessionStorage.getItem('communityId')

      this.addDialogVisible = true
    },

    // 修改按钮被点击
    updateBtnClick: function(data) {
      if (data.start === '未完成') {
        console.log(data)
        for (const key in this.dataForm1) {
          this.dataForm1[key] = data[key]
        }
        for (const key in this.dataForm2) {
          this.dataForm2[key] = data[key]
        }
        if (data.nameYi === '' || data.nameYi == null) {
          this.active = 1
        } else {
          this.active = 2
        }
        this.dataForm3 = {
          id: '', // 合同id
          startAndEndtime: [], // 起止时间
          rentInfo: [
            {
              house: '', // 房间
              rentMoney: '', // 月租金
              formYears: '', // 递增基时
              circle: '', // 递增周期
              rate: ''// 递增比例
            }
          ],
          chargingInfo: [
            {
              chargingPrograme: '',
              deviceNums: [],
              chargingPlan: ''
            }
          ]
        }
        this.addDialogVisible = true
      }
    },

    /**
     * 点击下一步
     */
    nextStep: function() {
      // console.log(this.dataForm1)
      if (this.active === 0) {
        // 添加物业合同
        this.savePropertyLeasingContract()
      } else if (this.active === 1) {
        // 更新物业合同
        this.savePLCYi()
      }
    },
    /**
     * 点击上一步
     */
    lastStep: function() {
      if (this.active > 0) {
        this.active--
      }
    },
    // 查询物业合同
    getList: function() {
      var params = {
        communityId: window.sessionStorage.getItem('communityId'),
        proSeachAll: this.queryName,
        pageIndex: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.loading = true
      getPropertyLeasingContract(params).then(result => {
        this.loading = false
        console.log(result)
        if (result.msg === 'success') {
          this.message = result.page
          this.total = result.recordes

          this.message.forEach(function(item) {
            item.start = getContractStatus(item.start)
          })
        } else {
          this.$message.error(result.msg)
        }
      }).catch(_ => {
        this.loading = false
      })
    },

    // 第一步 增加物业租赁合同
    savePropertyLeasingContract: function() {
      for (var key in this.dataForm1) {
        if (key === 'id') {
          continue
        }
        if (this.dataForm1[key] === '') {
          this.$message.warning('请填写完整信息')
          return
        }
      }
      this.dataForm1.start = 1
      savePropertyLeasingContract(this.dataForm1).then(result => {
        console.log(result)
        if (result.msg === 'success') {
          this.dataForm2.id = result.id
          this.active++
        } else {
          this.$message.error(result.msg)
        }
      })
    },

    // 第二步 更新物业租赁合同
    savePLCYi: function() {
      if (this.dataForm2.typeYi === '个人') {
        var data = this.dataForm2
        if (data.nameYi === '' || data.contactInformationYi === '' || data.contactAddressYi === '' || data.mailYi === '') {
          this.$message.warning('请填写完整信息')
          return
        }
      } else {
        for (var key in this.dataForm2) {
          if (this.dataForm2[key] === '') {
            this.$message.warning('请填写完整信息')
            return
          }
        }
      }

      savePLCYi(this.dataForm2).then(result => {
        if (result.msg === 'success') {
          this.active++
        } else {
          this.$message.error(result.msg)
        }
      })
    },

    // 第三步 增加技术合同
    saveRentlInt: function() {
      var params = {
        proId: this.dataForm2.id,
        startTime: yearAndMonthAndDay(this.dataForm3.startAndEndtime[0]),
        endTime: yearAndMonthAndDay(this.dataForm3.startAndEndtime[1]),
        housesInfo: this.dataForm3.rentInfo,
        rentInfo: this.dataForm3.chargingInfo
      }
      saveRentlInt(params).then(result => {
        console.log(result)
        if (result.msg === 'success') {
          this.$message.success('添加成功')
          this.addDialogVisible = false
        }
      })
    },

    // 删除合同
    deletePropertyLeasingContract: function(data) {
      this.$confirm('此操作将永久删除该档案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定data
        // 判断是删除房间还是删除设备
        var params = {
          communityId: window.sessionStorage.getItem('communityId'),
          contractNumber: data.contractNumber
        }
        this.loading = true
        deletePropertyLeasingContract(params).then(result => {
          this.loading = false
          if (result.msg === 'success') {
            this.$message.success('删除成功')
            this.getList()
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

    // 启动合同
    updataStart: function(data) {
      var params = {
        communityId: window.sessionStorage.getItem('communityId'),
        contractNumber: data.contractNumber
      }
      this.loading = true
      updataStart(params).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.$message.success('启动成功')
          this.getList()
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

<style scoped lang='scss'>
  .contractContainer{
    height: 100%;
    padding: 20px;
  }

  .condition{
    .el-input{
      width: 250px;
    }
    .el-button{
      margin-left: 20px;
    }
  }

  .tableMessage{
    margin-top: 30px;
  }

  .el-pagination{
    text-align: center;
  }
</style>
