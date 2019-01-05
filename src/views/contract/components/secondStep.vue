<template>
  <div class="secondStepContainer">
    <el-form label-width="100px" class="myForm">
      <el-form-item label="乙方类型">
        <el-select v-model="dataForm.typeYi" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.typeYi == '公司'" label="公司名">
        <el-input v-model="dataForm.corporateNameYi" size="medium" placeholder="公司名"/>
      </el-form-item>
      <el-form-item v-if="dataForm.typeYi == '公司'" label="法人代表" >
        <el-input v-model="dataForm.corporateRepresentativeYi" size="medium" placeholder="法人代表"/>
      </el-form-item>
      <el-form-item v-if="dataForm.typeYi == '公司'" label="税号" >
        <el-input v-model="dataForm.dutyParagraphYi" size="medium" placeholder="税号"/>
      </el-form-item>
      <el-form-item v-if="dataForm.typeYi == '公司'" label="单位地址">
        <el-input v-model="dataForm.unitAddressYi" size="medium" placeholder="单位地址"/>
      </el-form-item>
      <el-form-item v-if="dataForm.typeYi == '公司'" label="电话号码">
        <el-input v-model="dataForm.phoneNumberYi" size="medium" placeholder="电话号码"/>
      </el-form-item>
      <el-form-item label="联系人姓名">
        <el-input v-model="dataForm.nameYi" size="medium" placeholder="联系人"/>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="dataForm.contactInformationYi" size="medium" placeholder="联系方式"/>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="dataForm.contactAddressYi" size="medium" placeholder="联系地址"/>
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input v-model="dataForm.mailYi" size="medium" placeholder="电子邮箱"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SecondStep',
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
      options: [
        {
          value: '公司',
          label: '公司'
        },
        {
          value: '个人',
          label: '个人'
        }
      ]
    }
  }
}
</script>

<style scoped>

  .secondStepContainer{
    margin-top: 40px;
  }

.el-input,.el-select{
  width: 300px;
}
</style>
