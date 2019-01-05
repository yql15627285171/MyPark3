<template>
  <div class="thirdStepContainer">
    <h2>房租信息</h2>
    <el-form ref="dataForm" :model="dataForm" label-width="100px" class="myForm">
      <div v-for="(item,index) in dataForm.rentInfo" :key="index">
        <el-form-item
          :label="(index+1) + '、房间信息' ">
          <el-select v-model="item.house" placeholder="请选择">
            <el-option
              v-for="houseItem in houseOptions"
              :key="houseItem.value"
              :label="houseItem.label"
              :value="houseItem.value"
              size="medium"/>
          </el-select>
          <a v-show="dataForm.rentInfo.length>1" class="remove-item" @click.prevent="removeItem(index)">
            <i class="el-icon-remove-outline" style="color: red;font-size: 16px"/>
          </a>
          <a v-show="dataForm.rentInfo.length-1 == index" class="remove-item" @click.prevent="addItem()">
            <i class="el-icon-circle-plus-outline" style="color: green;font-size: 16px"/>
          </a>
        </el-form-item>

        <el-form-item label="起止时间">
          <el-date-picker
            v-model="item.startAndEndtime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="medium"/>
        </el-form-item>

        <el-form-item label="月租金">
          <el-input v-model="item.rentMoney" size="medium" placeholder="月租金"/>
        </el-form-item>

        <el-form-item label="递增基时">
          <el-input v-model="item.formYears" size="medium" placeholder="基时"/>
          <span>（由第几年后开始递增）</span>
        </el-form-item>

        <el-form-item label="递增周期(年)">
          <el-input v-model="item.circle" size="medium" placeholder="周期"/>
          <span>（每隔多少年递增一次）</span>
        </el-form-item>

        <el-form-item label="递增比例">
          <el-input v-model="item.rate" size="medium" placeholder="月租金"/>
          <span>（%）</span>
        </el-form-item>
        <!--<hr :key="index">-->
      </div>
      <hr>
      <h2>计费信息</h2>
      <div v-for="(item,index) in dataForm.chargingInfo" :key="index+1000">
        <el-form-item :label=" (index+1) + '、计费项目'">
          <el-select v-model="item.chargingPrograme" placeholder="请选择">
            <el-option
              v-for="chargeItem in chargingOptions"
              :key="chargeItem.value"
              :label="chargeItem.label"
              :value="chargeItem.value"
              size="medium"/>
          </el-select>
          <a v-show="dataForm.chargingInfo.length>1" class="remove-item" @click.prevent="removeCharge(index)">
            <i class="el-icon-remove-outline" style="color: red;font-size: 16px"/>
          </a>
          <a v-show="dataForm.chargingInfo.length-1 == index" class="remove-item" @click.prevent="addCharge()">
            <i class="el-icon-circle-plus-outline" style="color: green;font-size: 16px"/>
          </a>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-select
            v-model="item.deviceNums"
            multiple
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in deceiveNums"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="方案选择">
          <el-select v-model="item.chargingPlan" placeholder="请选择">
            <el-option
              v-for="planItem in planOptions"
              :key="planItem.value"
              :label="planItem.label"
              :value="planItem.value"
              size="medium"/>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ThirdStep',
  props: {
    houseOptions: {
      type: Array,
      default: function() {
        return null
      }
    },
    dataForm: {
      type: Object,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      chargingOptions: [
        {
          label: '电费',
          value: '电费'
        },
        {
          label: '水费',
          value: '水费'
        }
      ],
      deceiveNums: [
        {
          label: '4728432/电表',
          value: '1'
        },
        {
          label: '4728332/电表',
          value: '2'
        }
      ],
      planOptions: [
        {
          label: '方案1',
          value: '方案1'
        }
      ]
    }
  },
  methods: {
    removeItem: function(index) {
      this.dataForm.rentInfo.splice(index, 1)
    },
    addItem: function() {
      this.dataForm.rentInfo.push({
        house: '', // 房间
        startAndEndtime: [], // 起止时间
        rentMoney: '', // 月租金
        formYears: '', // 递增基时
        circle: '', // 递增周期
        rate: ''// 递增比例
      })
    },

    removeCharge: function(index) {
      this.dataForm.chargingInfo.splice(index, 1)
    },

    addCharge: function() {
      this.dataForm.chargingInfo.push({
        chargingPrograme: '', // 计费项目
        deviceNums: [], // 设备号
        chargingPlan: ''// 收费方案
      })
    }
  }

}
</script>

<style scoped>

  .thirdStepContainer{
    margin-top: 40px;
  }
  .el-select{
    width: 300px;
  }
  .el-input{
    width:300px;
  }
</style>
