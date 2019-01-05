<template>
  <div class="firstStepContainer">
    <el-form label-width="100px" class="myForm">
      <el-form-item label="方案名字">
        <el-select v-model="dataForm.contractName" filterable placeholder="请选择" @change="contractNameChange">
          <el-option
            v-for="item in jaTemplateInfo"
            :key="item.contractName"
            :label="item.contractName"
            :value="item.contractName"
            size="medium"/>
        </el-select>
      </el-form-item>
      <el-form-item label="公司名" >
        <el-input v-model="dataForm.corporateNameJa" size="medium" placeholder="请输入联系方式" disabled/>
      </el-form-item>
      <el-form-item label="法人代表" >
        <!--<span>{{ dataForm.corporateRepresentative }}</span>-->
        <el-input v-model="dataForm.corporateRepresentativeJa" size="medium" placeholder="请输入联系方式" disabled/>
      </el-form-item>
      <el-form-item label="税号" >
        <!--<span>{{ dataForm.dutyParagraph }}</span>-->
        <el-input v-model="dataForm.dutyParagraphJa" size="medium" placeholder="请输入联系方式" disabled/>
      </el-form-item>
      <el-form-item label="单位地址">
        <!--<span>{{ dataForm.companyAddress }}</span>-->
        <el-input v-model="dataForm.unitAddressJa" size="medium" placeholder="请输入联系方式" disabled/>
      </el-form-item>
      <el-form-item label="电话号码">
        <!--<span>{{ dataForm.mobilePhone }}</span>-->
        <el-input v-model="dataForm.phoneNumberJa" size="medium" placeholder="请输入联系方式" disabled/>
      </el-form-item>
      <el-form-item label="开户行" >
        <!--<span>{{ dataForm.countBank }}</span>-->
        <el-input v-model="dataForm.openingBankJa" size="medium" placeholder="请输入联系方式" disabled/>
      </el-form-item>
      <el-form-item label="收款账户">
        <!--<span>{{ dataForm.receivingAccount }}</span>-->
        <el-input v-model="dataForm.receivingAccountJa" size="medium" placeholder="请输入联系方式" disabled/>
      </el-form-item>
      <el-form-item label="联系人姓名">
        <el-input v-model="dataForm.nameJa" size="medium" placeholder="请输入联系人"/>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="dataForm.contactInformationJa" size="medium" placeholder="请输入联系方式"/>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="dataForm.contactAddressJa" size="medium" placeholder="请输入联系联系地址"/>
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input v-model="dataForm.mailJa" size="medium" placeholder="请输入电子邮箱"/>
      </el-form-item>
      <el-form-item label="收款人">
        <el-input v-model="dataForm.payee" size="medium" placeholder="请输入收款人"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getContractTempCondition } from '@/api/contract'
export default {
  name: 'FirstStep',
  props: {
    dataForm: {
      type: Object,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      jaTemplateInfo: [],
      options: [
        {
          label: '方案1',
          value: '方案1'
        }
      ]
    }
  },
  created() {
    this.getContractTempCondition()
  },
  methods: {
    // 查询甲方模板信息
    getContractTempCondition: function() {
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        contractName: '',
        pageIndex: 1,
        pageSize: 99999
      }
      getContractTempCondition(params).then(result => {
        console.log(result)
        if (result.msg === 'success') {
          this.jaTemplateInfo = result.page
        } else {
          // this.$message.error(result.msg)
        }
      }).catch(_ => {

      })
    },

    // 选择的模板名发生改变
    contractNameChange: function(value) {
      var temp = this.jaTemplateInfo.find(element => {
        return element.contractName === value
      })
      for (var key in this.dataForm) {
        if (key === 'communityId' || key === 'userId' || key === 'id') {
          continue
        }
        this.dataForm[key] = temp[key]
      }
    }
  }
}
</script>

<style scoped>

  .firstStepContainer{
    margin-top: 40px;
  }

  .el-input,.el-select{
    width: 300px;
  }
</style>
