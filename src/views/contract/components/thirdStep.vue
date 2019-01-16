<template>
  <div class="thirdStepContainer">

    <el-form ref="dataForm" :model="dataForm" label-width="100px" class="myForm">
      <h2>合同时间</h2>
      <el-form-item label="起止时间">
        <el-date-picker
          v-model="dataForm.startAndEndtime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="medium"/>
      </el-form-item>
      <!--<hr>-->
      <br>
      <h2>房租信息</h2>
      <div v-for="(item,index) in dataForm.rentInfo" :key="index">
        <el-form-item
          :label="(index+1) + '、房间信息' ">
          <el-select
            v-model="item.house"
            :remote-method="getHouses"
            :loading="loading"
            filterable
            remote
            reserve-keyword
            placeholder="请输入房间信息"
            @focus.prevent="selectFocus">
            <el-option
              v-for="houseItem in houseOptions"
              :key="houseItem.houseId"
              :label="houseItem.assets_name"
              :value="houseItem.houseId"/>
          </el-select>

          <a v-show="dataForm.rentInfo.length>1" class="remove-item" @click.prevent="removeItem(index)">
            <i class="el-icon-remove-outline" style="color: red;font-size: 16px"/>
          </a>
          <a v-show="dataForm.rentInfo.length-1 == index" class="remove-item" @click.prevent="addItem()">
            <i class="el-icon-circle-plus-outline" style="color: green;font-size: 16px"/>
          </a>
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
      <!--<hr>-->
      <br>
      <h2>计费信息</h2>
      <div v-for="(item,index) in dataForm.chargingInfo" :key="index+1000">
        <el-form-item :label=" (index+1) + '、计费项目'">
          <el-select v-model="item.chargingPrograme" placeholder="请选择" @change="chargingProgrameChange(index)">
            <el-option
              v-for="chargeItem in chargingOptions"
              :key="chargeItem.coName"
              :label="chargeItem.coName"
              :value="chargeItem.coName"
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
            placeholder="请选择"
            @focus="getDeviceByHouse(index)">
            <el-option
              v-for="device in deceiveNums"
              :key="device.id"
              :label="device.assetsCode"
              :value="device.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="方案选择">
          <el-select
            v-model="item.chargingPlan"
            placeholder="请选择"
            @focus="getCoTyPL(index)">
            <el-option
              v-for="planItem in planOptions[index]"
              :key="planItem.id"
              :label="planItem.schemeName"
              :value="planItem.id"
              size="medium"/>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  getHouses,
  listCostType,
  getCoTyPL,
  getHouAss } from '@/api/contract'
export default {
  name: 'ThirdStep',
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
      loading: false,
      houseOptions: [],
      chargingOptions: [],
      deceiveNums: [],
      planOptions: []
    }
  },
  created() {
    this.listCostType()
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
      this.planOptions.splice(index, 1)
    },

    addCharge: function() {
      this.dataForm.chargingInfo.push({
        chargingPrograme: '', // 计费项目
        deviceNums: [], // 设备号
        chargingPlan: ''// 收费方案
      })
      // this.planOptions.push([])
    },

    // 获取房子列表
    getHouses: function(query) {
      if (query === '') {
        return
      }
      var params = {
        communityId: window.sessionStorage.getItem('communityId'),
        proSeachAll: query
      }
      this.loading = true
      getHouses(params).then(result => {
        this.loading = false
        console.log(result)
        if (result.msg === 'success') {
          this.houseOptions = result.houses
        }
      })
    },

    // 选择框聚焦的时候清空数据
    selectFocus: function() {
      this.houseOptions = []
    },

    // 获取收费类型
    listCostType: function() {
      var params = {
        communityId: window.sessionStorage.getItem('communityId')
      }
      listCostType(params).then(result => {
        if (result.msg === 'success') {
          this.chargingOptions = result.page
        }
      })
    },

    // 计费项目发生改变
    chargingProgrameChange: function(index) {
      // 清空设备编号和方案选择
      this.deceiveNums = []
      this.dataForm.chargingInfo[index].deviceNums = []
      this.planOptions = []
      this.dataForm.chargingInfo[index].chargingPlan = ''
    },

    // 根据收费类型选择方案
    getCoTyPL: function(index) {
      this.dataForm.chargingInfo[index].chargingPlan = ''
      var category = this.dataForm.chargingInfo[index].chargingPrograme
      if (category === '') {
        return
      }
      var params = {
        communityId: window.sessionStorage.getItem('communityId'),
        schemeCategory: category
      }
      getCoTyPL(params).then(result => {
        if (result.msg === 'success') {
          this.planOptions[index] = result.page
          this.planOptions = [...this.planOptions]
        }
      })
    },

    // 根据所选房间获取绑定房间的设备
    getDeviceByHouse: function(index) {
      var tempHouser = []
      this.dataForm.chargingInfo[index].deviceNums = []
      this.dataForm.rentInfo.forEach(element => {
        if (element.house !== '') {
          tempHouser.push(element.house)
        }
      })

      var params = {
        communityId: window.sessionStorage.getItem('communityId'),
        coType: this.dataForm.chargingInfo[index].chargingPrograme,
        houseId: tempHouser
      }
      getHouAss(params).then(result => {
        console.log(result)
        if (result.msg === 'success') {
          this.deceiveNums = result.page
        }
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
