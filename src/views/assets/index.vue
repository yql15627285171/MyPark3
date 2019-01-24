<template>
  <div class="assets-container">
    <div class="condition">
      <el-input
        v-model="queryName"
        placeholder="资产编号"
        prefix-icon="el-icon-search"
        size="medium"/>
      <el-select v-model="assetsClass" clearable placeholder="资产类别" size="medium">
        <el-option
          v-for="item in assetsClassInfo"
          :key="item.assetsClass"
          :label="item.assetsClass"
          :value="item.assetsClass"/>
      </el-select>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button type="primary" size="medium" icon="el-icon-edit" @click="addDeviceBtnClick">安装设备</el-button>
      <el-button type="primary" size="medium" icon="el-icon-edit" @click="addHouseBtnClick">新增楼房</el-button>
    </div>
    <!--设备安装/修改-->
    <el-dialog :visible.sync="deviceDialogVisible" title="添加/修改 表计">
      <el-form ref="deviceDataForm" :model="deviceDataForm" label-width="100px" class="myForm">
        <el-form-item label="资产编号" prop="assetsCode" >
          <el-input
            v-model.lazy.trim="deviceDataForm.assetsCode"
            :disabled="operationType!='addDevice'"
            size="medium"
            placeholder="请输入"
            @change="enableDevice"/>
          <span style="color: red">{{ deviceType }}</span>
        </el-form-item>

        <el-form-item label="栋/街/层" prop="building">
          <el-select
            v-model="deviceDataForm.building"
            filterable
            placeholder="请选择"
            size="medium"
            @change="buildingChange">
            <el-option
              v-for="item in buildings"
              :key="item.building"
              :label="item.building"
              :value="item.building"/>
          </el-select>
        </el-form-item>
        <el-form-item label="房间号" prop="houseId">
          <el-select
            v-model="deviceDataForm.houseId"
            filterable
            placeholder="请选择"
            size="medium">
            <el-option
              v-for="item in houses"
              :key="item.id"
              :label="item.houseNo"
              :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="安装地址" prop="assesInfo" >
          <el-input v-model="deviceDataForm.installAddress" size="medium" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="运行状态" prop="runStatus" >
          <el-radio-group v-model="deviceDataForm.runStatus">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input v-model="deviceDataForm.remark" size="medium" placeholder="请输入"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deviceDialogVisible=false">取消</el-button>
        <el-button :disabled="sureBtnDisabled" type="primary" @click="submitFormData">确定</el-button>
      </div>
    </el-dialog>

    <!--房间添加/需改-->
    <el-dialog :visible.sync="houseDialogVisible" title="增加/修改房间">
      <el-form ref="houseDataForm" :model="houseDataForm" label-width="100px" class="myForm">

        <el-form-item label="栋/街/层" prop="building" >
          <el-input
            v-model="houseDataForm.building"
            :disabled="operationType!='addHouse'"
            size="medium"
            placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="房间号" prop="houseNo" >
          <el-input v-model="houseDataForm.houseNo" size="medium" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="倍率(CT)" prop="ratio" >
          <el-input v-model="houseDataForm.ratio" size="medium" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="建筑面积(㎡)" prop="coveredArea">
          <el-input v-model="houseDataForm.coveredArea" size="medium" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input v-model="houseDataForm.remark" size="medium" placeholder="请输入"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="houseDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitFormData">确认</el-button>
      </div>
    </el-dialog>

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
          v-for="(item,index) in messageName"
          :key="index"
          :prop="item.name"
          :label="item.label"
          :width="item.width"/>

        <el-table-column
          label="操作">
          <template slot-scope="scope" >

            <el-button
              type="text"
              size="small"
              style="color: #55a532"
              @click="updateBtnClick(scope.row)">
              <i class="el-icon-edit"/>
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              style="color: #df5000"
              @click="deleteAssets(scope.row)">
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

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  getPageList,
  enableDevice,
  postCommHouseInfo,
  getBuildingList,
  getHouseByBuilding,
  saveMeterInfo,
  deleteMeterInfo,
  deleteMHInfo,
  updateMH,
  updateMeterInfo,
  ListAssetsClass
} from '@/api/assets'
import { getDeviceType, getStatus, getStatusNumber } from '@/utils/meaning'
export default {
  name: 'Assets',
  components: { Pagination },
  data() {
    return {
      loading: false,
      queryName: '',
      assetsClassInfo: [], // 资产类型
      assetsClass: '', // 要查询的资产类型
      total: 0, // 表格数据的总数
      listQuery: {
        page: 1,
        limit: 20
      }, // 二次封装的分页器数据
      message: [], // 显示的表格数据
      messageName: [
        {
          label: '资产类别',
          name: 'assetsClass'
        },
        {
          label: '资产名称',
          name: 'assetsName'
        },
        {
          label: '资产型号',
          name: 'deviceMode'
          // width: '180'
        },
        {
          label: '资产编号',
          name: 'assetsCode'
          // width: '150'
        },
        {
          label: '资产信息',
          name: 'assetsInfo',
          width: '280'
        },
        {
          label: '状态',
          name: 'runStatus',
          width: '80'
        },
        {
          label: '备注',
          name: 'remark'
        }
      ],
      deviceDialogVisible: false,
      houseDialogVisible: false,
      deviceDataForm: {
        userId: parseInt(window.sessionStorage.getItem('userId')),
        id: '',
        assetsCode: '', // 资产编号
        building: '',
        houseId: '',
        assesInfo: '', // 设备信息
        installAddress: '', // 安装地址
        runStatus: 0, // 运行状态
        remark: '' // 备注信息
      }, // 设备信息表
      sureBtnDisabled: true,
      houseDataForm: {
        userId: parseInt(window.sessionStorage.getItem('userId')),
        id: '',
        meterId: '',
        houseId: '',
        building: '',
        houseNo: '',
        ratio: '',
        coveredArea: '',
        remark: ''
      }, // 楼房信息表
      operationType: '', // 操作类型，区分添加还是修改
      deviceType: '', // 设备类型，用来显示提示用户
      buildings: [], // 可选择的楼栋列表
      buildingLoading: false,
      houses: [], // 可选择的房间列表
      houseLoading: false
    }
  },
  created() {
    this.getList()
    this.ListAssetsClass()
  },
  methods: {

    sortIndex: function(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    // 设置表格
    tableHeadStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'background:#409EFF;color:#fff;text-align:center'
    },
    // 表格体
    tableRowStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center;padding:3px;'
    },

    // 获取社区对应的楼街栋
    getBuildingList: function() {
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        building: ''
      }
      getBuildingList(params).then(result => {
        this.buildings = result.page
      })
    },

    // 社区变化的时候要重新获取对应的房间列表
    buildingChange: function(value) {
      this.houses = []
      this.deviceDataForm.houseId = ''
      if (value !== '') {
        this.getHouseByBuilding()
      }
    },

    // 获取楼街栋对应的房间列表
    getHouseByBuilding: function() {
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        Building: this.deviceDataForm.building,
        houseNo: ''
      }
      getHouseByBuilding(params).then(result => {
        this.houses = result.page
      })
    },

    getList() {
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        assetsCode: this.queryName,
        assetsClass: this.assetsClass,
        pageIndex: this.listQuery.page,
        pageSize: this.listQuery.limit
      }

      this.loading = true

      getPageList(params).then(result => {
        this.loading = false
        // console.log(result)
        if (result.msg === 'success') {
          this.message = result.page
          this.message.forEach(function(item, index, array) {
            item.runStatus = getStatus(item.runStatus)
          })
          this.total = result.recordes
        } else {
          this.$message.error(result.msg)
        }
      }).catch(_ => {
        this.loading = false
        // console.log(error)
      })
    },

    // 获取资产类型
    ListAssetsClass: function() {
      var params = {
        communityId: window.sessionStorage.getItem('communityId')
      }
      ListAssetsClass(params).then(result => {
        this.assetsClassInfo = result.page
      })
    },

    // 点击安装设备
    addDeviceBtnClick: function() {
      this.deviceDialogVisible = true
      this.operationType = 'addDevice'
      this.deviceDataForm.id = ''// 获取对应楼街栋列表
      this.getBuildingList() // 重新获取栋街层列表
    },

    // 点击新增房间按钮
    addHouseBtnClick: function() {
      this.operationType = 'addHouse'
      this.houseDataForm.id = ''
      this.houseDataForm.meterId = ''
      this.houseDataForm.houseId = ''
      this.houseDialogVisible = true
    },

    // 提交表单
    submitFormData: function() {
      if (this.operationType === 'addHouse') {
        this.postCommHouseInfo()
      } else if (this.operationType === 'addDevice') {
        this.saveMeterInfo()
      } else if (this.operationType === 'updateHouse') {
        this.updateMH()
      } else if (this.operationType === 'updateDevice') {
        this.updateMeterInfo()
      }
    },

    // 新增房间
    postCommHouseInfo: function() {
      if (
        this.houseDataForm.building.length === 0 ||
        this.houseDataForm.houseNo.length === 0 ||
        this.houseDataForm.coveredArea.length === 0 ||
        this.houseDataForm.ratio.length === 0
      ) {
        this.$message.warning('请填写好信息')
        return
      }
      this.houseDialogVisible = false
      // console.log(this.houseDataForm)
      this.loading = true
      postCommHouseInfo(this.houseDataForm).then(result => {
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

    // 检查表计是否可安装
    enableDevice: function() {
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        DeviceId: this.deviceDataForm.assetsCode
      }
      enableDevice(params).then(result => {
        // console.log(result)
        if (result.status === 'ok') {
          this.deviceType = getDeviceType(result.data.DeviceType)
          this.sureBtnDisabled = false
        } else {
          this.deviceType = result.data
          this.sureBtnDisabled = true
        }
      })
    },

    // 添加设备
    saveMeterInfo: function() {
      var dataForm = this.deviceDataForm
      if (
        dataForm.assetsCode === '' ||
        dataForm.houseId === '' ||
        dataForm.installAddress === ''
      ) {
        this.$message.warning('请填写完整的信息')
        return
      }
      this.loading = true
      this.deviceDialogVisible = false
      var houseItem = this.houses.find(element => {
        return element.id === this.deviceDataForm.houseId
      })
      this.deviceDataForm.assetsInfo = `安装地址：${this.deviceDataForm.installAddress}-
      ${this.deviceDataForm.building}${houseItem.houseNo}`

      saveMeterInfo(this.deviceDataForm).then(result => {
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

    // 点击删除按钮 删除资产
    deleteAssets: function(data) {
      this.$confirm('此操作将永久删除该档案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定data
        // 判断是删除房间还是删除设备
        if (data.assetsClass === '房地产业') {
          // 删除房间
          this.deleteCommHouseInfo(data)
        } else {
          this.deleteMeterInfo(data)
        }
      }).catch(() => {
        // 点击取消
      })
    },

    // 删除房间
    deleteCommHouseInfo: function(data) {
      this.loading = true
      var params = {
        id: data.id,
        houseId: data.houseId
      }
      deleteMHInfo(params).then(result => {
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
    },

    // 删除除房间外的设备
    deleteMeterInfo: function(data) {
      this.loading = true
      var params = {
        ids: data.id
      }
      deleteMeterInfo(params).then(result => {
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
    },

    // 修改按钮本点击
    updateBtnClick: function(data) {
      if (data.assetsClass === '房地产业') {
        this.operationType = 'updateHouse'
        this.houseDataForm.building = data.building
        this.houseDataForm.meterId = parseInt(data.id)
        this.houseDataForm.houseNo = data.houseNo
        this.houseDataForm.houseId = parseInt(data.houseId)
        this.houseDataForm.id = parseInt(data.houseId)
        this.houseDataForm.ratio = data.ratio
        this.houseDataForm.coveredArea = data.coveredArea
        this.houseDataForm.remark = data.remark
        this.houseDialogVisible = true
      } else {
        this.operationType = 'updateDevice'
        // console.log(data.runStatus)
        this.deviceDataForm.runStatus = getStatusNumber(data.runStatus)
        this.deviceDataForm.id = data.id
        this.deviceDataForm.assetsCode = data.assetsCode
        this.deviceDataForm.building = data.building
        this.deviceDataForm.houseId = data.houseId
        this.deviceDataForm.installAddress = data.installAddress
        this.deviceDataForm.assesInfo = data.assesInfo
        this.deviceDataForm.remark = data.remark

        this.enableDevice()
        this.getBuildingList()
        this.getHouseByBuilding()
        this.deviceDialogVisible = true
      }
    },

    // 更新除房间外的信息
    updateMeterInfo: function() {
      var dataForm = this.deviceDataForm
      if (
        dataForm.assetsCode === '' ||
        dataForm.houseId === '' ||
        dataForm.installAddress === ''
      ) {
        this.$message.warning('请填写完整的信息')
        return
      }
      this.loading = true
      this.deviceDialogVisible = false
      var houseItem = this.houses.find(element => {
        return element.id === this.deviceDataForm.houseId
      })
      this.deviceDataForm.assetsInfo = `安装地址：${this.deviceDataForm.installAddress}-${this.deviceDataForm.building}${houseItem.houseNo}`

      updateMeterInfo(this.deviceDataForm).then(result => {
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

    // 更新房间信息
    updateMH: function() {
      if (
        this.houseDataForm.building.length === 0 ||
        this.houseDataForm.houseNo.length === 0 ||
        this.houseDataForm.coveredArea.length === 0 ||
        this.houseDataForm.ratio.length === 0
      ) {
        this.$message.warning('请填写好信息')
        return
      }
      this.houseDialogVisible = false
      console.log(this.houseDataForm)
      this.loading = true
      updateMH(this.houseDataForm).then(result => {
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
.assets-container {
  height: 100%;
  padding: 20px;
}

.condition {
  display: flex;

  .el-button {
    margin-left: 20px;
  }
}

.tableMessage {
  margin-top: 30px;
}

.el-pagination {
  text-align: center;
}

.el-input {
  width: 250px;
}

.el-select {
  width: 140px;
  margin-left: 20px;
}
</style>
