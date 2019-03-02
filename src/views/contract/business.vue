<template>
  <div class="businessContainer">
    <div class="condition">
      <el-input
        v-model="queryName"
        placeholder="方案名"
        prefix-icon="el-icon-search"
        size="medium"/>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button type="primary" size="medium" icon="el-icon-circle-plus-outline" @click="addBtnClick">添加</el-button>
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
                v-if="index<=6"
                :label="item.label"
                :key="index">
                <span>{{ props.row[item.name] }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          :index="sortIndex"
          label="序号"
          type="index"
          width="70"/>

        <el-table-column
          v-for="(item,index) in messageName"
          v-if="index>6"
          :key="index"
          :prop="item.name"
          :label="item.label"
          :width="item.width"/>

        <el-table-column
          label="操作">
          <template slot-scope="scope" >
            <el-button
              v-if="scope.row.starte === '未启用'"
              type="text"
              size="small"
              style="color: #55a532"
              @click="updateBtnClick(scope.row)">
              <i class="el-icon-edit"/>
              修改
            </el-button>
            <el-button
              v-if="scope.row.starte === '未启用'"
              type="text"
              size="small"
              style="color: #df5000"
              @click="deleteContractTemp(scope.row)">
              <i class="el-icon-delete"/>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="el-pagination">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <!--弹框信息-->
    <el-dialog :visible.sync="dialogVisible" title="添加/修改 甲方方案">
      <el-form ref="dataForm" :model="dataForm" label-width="100px" class="myForm">
        <el-form-item label="方案名字" prop="contractName" >
          <el-input v-model="dataForm.contractName" size="medium" placeholder="请输入方案名字"/>
        </el-form-item>
        <el-form-item label="公司名" prop="corporateNameJa" >
          <el-input v-model="dataForm.corporateNameJa" size="medium" placeholder="请输入公司名"/>
        </el-form-item>
        <el-form-item label="法人代表" prop="corporateRepresentativeJa" >
          <el-input v-model="dataForm.corporateRepresentativeJa" size="medium" placeholder="请输入法人代表"/>
        </el-form-item>
        <el-form-item label="税号" prop="dutyParagraphJa" >
          <el-input v-model="dataForm.dutyParagraphJa" size="medium" placeholder="请输入税号"/>
        </el-form-item>
        <el-form-item label="单位地址" prop="unitAddressJa" >
          <el-input v-model="dataForm.unitAddressJa" size="medium" placeholder="请输入单位地址"/>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneNumberJa" >
          <el-input v-model="dataForm.phoneNumberJa" size="medium" placeholder="请输入电话号码"/>
        </el-form-item>
        <el-form-item label="开户行" prop="openingBankJa" >
          <el-input v-model="dataForm.openingBankJa" size="medium" placeholder="请输入开户行"/>
        </el-form-item>
        <el-form-item label="收款账户" prop="receivingAccountJa" >
          <el-input v-model="dataForm.receivingAccountJa" size="medium" placeholder="请输入收款账户"/>
        </el-form-item>
        <el-form-item label="联系人" prop="nameJa" >
          <el-input v-model="dataForm.nameJa" size="medium" placeholder="请输入联系人"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactInformationJa" >
          <el-input v-model="dataForm.contactInformationJa" size="medium" placeholder="请输入联系方式"/>
        </el-form-item>
        <el-form-item label="联系地址" prop="contactAddressJa" >
          <el-input v-model="dataForm.contactAddressJa" size="medium" placeholder="请输入联系联系地址"/>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="mailJa" >
          <el-input v-model="dataForm.mailJa" size="medium" placeholder="请输入电子邮箱"/>
        </el-form-item>
        <el-form-item label="收款人" prop="payee" >
          <el-input v-model="dataForm.payee" size="medium" placeholder="请输入收款人"/>
        </el-form-item>
        <el-form-item label="条款" prop="clause">
          <el-input v-model="dataForm.clause" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning">取消</el-button>
        <el-button type="primary" @click="submitDataForm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { saveContractTemp, getContractTempCondition, deleteContractTemp, updateContractTemp } from '@/api/contract'
import { getBusinessStatus, getBusinessStatusNumber, objDeepCopy } from '@/utils/meaning'
export default {
  name: 'Business',
  components: { Pagination },
  data() {
    return {
      loading: false,
      total: 0, // 表格数据的总数
      queryName: '',
      listQuery: {
        page: 1,
        limit: 20
      }, // 二次封装的分页器数据
      message: [],
      messageName: [
        {
          label: '公司名',
          name: 'corporateNameJa'
        },
        {
          label: '法人代表',
          name: 'corporateRepresentativeJa'
        },
        {
          label: '税号',
          name: 'dutyParagraphJa'
        },
        {
          label: '单位地址',
          name: 'unitAddressJa'
        },
        {
          label: '电话号码',
          name: 'phoneNumberJa'
        },
        {
          label: '开户行',
          name: 'openingBankJa'
        },
        {
          label: '收款账户',
          name: 'receivingAccountJa'
        },
        {
          label: '方案名字',
          name: 'contractName'
        },
        {
          label: '联系人',
          name: 'nameJa'
        },
        {
          label: '联系方式',
          name: 'contactInformationJa'
        },
        {
          label: '联系地址',
          name: 'contactAddressJa'
        },
        {
          label: '电子邮箱',
          name: 'mailJa'
        },
        {
          label: '收款人',
          name: 'payee'
        },
        {
          label: '状态',
          name: 'starte'
        }

      ],
      dataForm: {
        id: '',
        userId: parseInt(window.sessionStorage.getItem('userId')),
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
      },
      dialogVisible: false,
      operationType: ''
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
      return 'text-align:center;padding:3px;'
    },
    // 排序
    sortIndex: function(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },

    // 添加按钮被点击
    addBtnClick: function() {
      this.operationType = 'add'
      for (var key in this.dataForm) {
        this.dataForm[key] = ''
      }
      this.dataForm.userId = parseInt(window.sessionStorage.getItem('userId'))
      this.dialogVisible = true
    },
    // 更新按钮被点击
    updateBtnClick: function(data) {
      this.dataForm = objDeepCopy(data)
      this.dataForm.userId = parseInt(window.sessionStorage.getItem('userId'))
      this.dataForm.starte = getBusinessStatusNumber(this.dataForm.starte)
      this.operationType = 'update'
      this.dialogVisible = true
    },

    // 提交表单
    submitDataForm: function() {
      if (this.operationType === 'add') {
        this.saveContractTemp()
      } else if (this.operationType === 'update') {
        this.updateContractTemp()
      }
    },

    // 获取调用查询接口
    getList: function() {
      this.message = []
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        contractName: this.queryName,
        pageIndex: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.loading = true
      getContractTempCondition(params).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.message = result.page
          this.total = result.recordes
          this.message.forEach(function(item, index, array) {
            item.starte = getBusinessStatus(item.starte)
          })
        } else {
          this.$message.error(result.msg)
        }
      }).catch(_ => {
        this.loading = false
      })
    },

    // 增加商务方案
    saveContractTemp: function() {
      for (var key in this.dataForm) {
        if (key === 'id' || key === 'communityId' || key === 'starte' || key === 'receivingAcc') {
          continue
        }
        if (this.dataForm[key] === '') {
          this.$message.warning('请填写好完整信息')
          return
        }
      }
      this.loading = true
      this.dialogVisible = false
      saveContractTemp(this.dataForm).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.$message.success('添加成功')
          this.getList()
        } else {
          this.$message.error(result.msg)
        }
      }).catch(_ => {
        this.loading = false
      })
    },

    // 删除商务方案
    deleteContractTemp: function(data) {
      this.$confirm('此操作将永久删除该档案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          id: parseInt(data.id)
        }
        this.loading = true
        deleteContractTemp(params).then(result => {
          this.loading = false
          console.log(result)
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

    // 修改商务方案
    updateContractTemp: function() {
      for (var key in this.dataForm) {
        // if (key === 'id' || key === 'communityId' || key === 'starte' || key === 'receivingAcc') {
        //   continue
        // }
        if (this.dataForm[key] === '') {
          this.$message.warning('请填写好完整信息')
          return
        }
      }
      this.loading = true
      this.dialogVisible = false
      console.log(this.dataForm)
      updateContractTemp(this.dataForm).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.$message.success('修改成功')
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
  .businessContainer{
    height: 100%;
    padding: 20px;
  }

  .el-input{
    width: 300px;
  }
  .tableMessage{
    margin-top: 30px;
  }

  .el-pagination{
    text-align: center;
  }

  .condition{

    .el-button{
      margin-left: 20px;
    }

    .el-input{
      width: 250px;
    }
  }

</style>
