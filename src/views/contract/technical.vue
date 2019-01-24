<template>
  <div class="assets-container">
    <div class="condition">
      <el-input
        v-model="queryName"
        placeholder="方案名"
        prefix-icon="el-icon-search"
        size="medium"/>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button type="primary" size="medium" icon="el-icon-circle-plus-outline" @click="monthBtnClick">固定</el-button>
      <el-button type="primary" size="medium" icon="el-icon-circle-plus-outline" @click="simpleBtnClick">单价</el-button>
      <el-button type="primary" size="medium" icon="el-icon-circle-plus-outline" @click="complexBtnClick">阶梯</el-button>
      <el-button type="primary" size="medium" icon="el-icon-circle-plus-outline" @click="timeBtnClick">分时</el-button>
    </div>

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
          label="序号"
          type="index"
          width="50"/>

        <el-table-column
          prop="schemeCategory"
          label="费用类别"/>
        <el-table-column
          prop="schemeName"
          label="方案名称"/>
        <el-table-column
          prop="setype"
          label="方案类型"/>
        <el-table-column
          align="left"
          prop="programme"
          label="方案信息">
          <template slot-scope="scope">
            <div v-html="scope.row.programme"/>
          </template>
        </el-table-column>

        <el-table-column
          label="操作">
          <template slot-scope="scope" >
            <el-button
              type="text"
              size="small"
              style="color: #df5000"
              @click="deleteCost(scope.row)">
              <i class="el-icon-delete" />
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="el-pagination">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <!--月结定值-->
    <el-dialog :visible.sync="monthDialogVisible" title="添加月结定值方案">
      <el-form ref="monthDataForm" :model="monthDataForm" label-width="100px" class="myForm">

        <el-form-item label="方案名字" prop="schemeName" >
          <el-input v-model="monthDataForm.schemeName" size="medium" placeholder="请输入方案名字"/>
        </el-form-item>

        <el-form-item label="费用类别" prop="schemeCategory" >
          <el-radio-group v-model="monthDataForm.schemeCategory">
            <el-radio v-for="(category,index) in categoryOptions" :key="index" :label="category.coName">
              {{ category.coName }}
            </el-radio>

          </el-radio-group>
        </el-form-item>

        <el-form-item label="费用(月)" prop="programme" >
          <el-input v-model="monthDataForm.programme" size="medium" placeholder="请输入费用"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="monthDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCost(monthDataForm)">确认</el-button>
      </div>
    </el-dialog>
    <!--单费率-->
    <el-dialog :visible.sync="simpleDialogVisible" title="添加单费率方案">
      <el-form ref="simpleDataForm" :model="simpleDataForm" label-width="100px" class="myForm">

        <el-form-item label="方案名字" prop="schemeName" >
          <el-input v-model="simpleDataForm.schemeName" size="medium" placeholder="请输入方案名字"/>
        </el-form-item>

        <el-form-item label="费用类别" prop="schemeCategory" >
          <el-radio-group v-model="simpleDataForm.schemeCategory">
            <el-radio v-for="(category,index) in categoryOptions" :key="index" :label="category.coName">
              {{ category.coName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="单价" prop="programme" >
          <el-input v-model="simpleDataForm.programme" size="medium" placeholder="请输入费用"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="simpleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCost(simpleDataForm)">确认</el-button>
      </div>
    </el-dialog>
    <!--阶梯费率-->
    <el-dialog :visible.sync="complexDialogVisible" title="添加阶梯费率方案">
      <el-form ref="simpleDataForm" :model="simpleDataForm" label-width="100px" class="myForm">

        <el-form-item label="方案名字" prop="schemeName" >
          <el-input v-model="complexDataForm.schemeName" size="medium" placeholder="请输入方案名字"/>
        </el-form-item>

        <el-form-item label="费用类别" prop="schemeCategory" >
          <el-radio-group v-model="complexDataForm.schemeCategory">
            <el-radio v-for="(category,index) in categoryOptions" :key="index" :label="category.coName">
              {{ category.coName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-for="(item,index) in complexDataForm.programme"
          :label=" '阶梯' + (index + 1) "
          :key="index">
          <el-input v-model="item.value1" size="medium" placeholder="阶梯量" style="width: 100px!important;"/>
          <span>-</span>
          <el-input v-model="item.value2" size="medium" placeholder="阶梯量" style="width: 100px!important;"/>
          <el-input v-model="item.price" size="medium" placeholder="价格" style="width: 100px!important;"/>
          <span>元</span>
          <a v-show="complexDataForm.programme.length>1" class="remove-item" @click.prevent="removeItem(index)">
            <i class="el-icon-remove-outline" style="color: red;font-size: 16px"/>
          </a>
          <a v-show="complexDataForm.programme.length-1 == index" class="remove-item" @click.prevent="addItem()">
            <i class="el-icon-circle-plus-outline" style="color: green;font-size: 16px"/>
          </a>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button >取消</el-button>
        <el-button type="primary" @click="saveCost(complexDataForm)">确认</el-button>
      </div>
    </el-dialog>
    <!--时间阶梯-->
    <el-dialog :visible.sync="timeDialogVisible" title="添加阶梯费率方案">
      <el-form ref="timeDataForm" :model="timeDataForm" label-width="100px" class="myForm">

        <el-form-item label="方案名字" prop="schemeName" >
          <el-input v-model="timeDataForm.schemeName" size="medium" placeholder="请输入方案名字"/>
        </el-form-item>

        <el-form-item label="费用类别" prop="schemeCategory" >
          <el-radio-group v-model="timeDataForm.schemeCategory">
            <el-radio v-for="(category,index) in categoryOptions" :key="index" :label="category.coName">
              {{ category.coName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="定价(元)" prop="feeKind" >
          <span>尖</span>
          <el-input v-model="timeDataForm.price1" size="medium" placeholder="价格" style="width: 60px!important;margin-right: 10px"/>
          <span>峰</span>
          <el-input v-model="timeDataForm.price2" size="medium" placeholder="价格" style="width: 60px!important;margin-right: 10px"/>
          <span>平</span>
          <el-input v-model="timeDataForm.price3" size="medium" placeholder="价格" style="width: 60px!important;margin-right: 10px"/>
          <span>谷</span>
          <el-input v-model="timeDataForm.price4" size="medium" placeholder="价格" style="width: 60px!important;margin-right: 10px"/>
        </el-form-item>

        <el-form-item
          v-for="(item,index) in timeDataForm.programme"
          :label=" '时间' + (index + 1) "
          :key="index">
          <el-time-picker
            v-model="item.startTime"
            format="HH:mm"
            placeholder="任意时间点"
            style="width: 150px!important;"/>
          <span>至</span>
          <el-time-picker
            v-model="item.endTime"
            format="HH:mm"
            placeholder="任意时间点"
            style = "width: 150px!important;"/>
          <el-select v-model="item.value" placeholder="选择">
            <el-option
              v-for="priceType in options"
              :key="priceType.value"
              :label="priceType.label"
              :value="priceType.value"/>
          </el-select>
          <a v-show="timeDataForm.programme.length>1" class="remove-item" @click.prevent="removeTime(index)">
            <i class="el-icon-remove-outline" style="color: red;font-size: 16px"/>
          </a>
          <a v-show="timeDataForm.programme.length-1 == index" class="remove-item" @click.prevent="addTime()">
            <i class="el-icon-circle-plus-outline" style="color: green;font-size: 16px"/>
          </a>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button >取消</el-button>
        <el-button type="primary" @click="saveCost(timeDataForm)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { hourAndMinute } from '@/utils/time'
import { saveCost, getCostPlanCondition, deleteCost, listCostType } from '@/api/contract'
export default {
  name: 'Technical',
  components: { Pagination },
  data() {
    return {
      loading: false,
      queryName: '',
      total: 0, // 表格数据的总数
      listQuery: {
        page: 1,
        limit: 20
      }, // 二次封装的分页器数据
      message: [], // 显示的表格数据
      messageName: [
        {
          label: '费用类别',
          name: 'schemeCategory'
        },
        {
          label: '方案名称',
          name: 'schemeName'
        },
        {
          label: '方案类型',
          name: 'setype'
        },
        {
          label: '方案信息',
          name: 'programme'
        }
      ],
      monthDialogVisible: false,
      simpleDialogVisible: false,
      complexDialogVisible: false,
      timeDialogVisible: false,
      monthDataForm: {
        communityId: window.sessionStorage.getItem('communityId'),
        schemeName: '', // 名
        schemeCategory: '', // 类别
        programme: '', // 组织起来的方案信息
        setype: '固定' // 方案类型
      },
      simpleDataForm: {
        communityId: window.sessionStorage.getItem('communityId'),
        schemeName: '', // 名
        schemeCategory: '', // 类别
        programme: '', // 综合信息
        setype: '单价' // 方案类型
      },
      complexDataForm: {
        communityId: window.sessionStorage.getItem('communityId'),
        schemeName: '', // 名
        schemeCategory: '', // 类别
        programme: [
          {
            value1: '',
            value2: '',
            price: ''
          }
        ], // 综合信息
        setype: '阶梯' // 方案类型
      },
      timeDataForm: {
        communityId: window.sessionStorage.getItem('communityId'),
        schemeName: '', // 名
        schemeCategory: '', // 类别
        price1: '', // 尖
        price2: '', // 峰
        price3: '', // 平
        price4: '', // 谷
        programme: [
          {
            value: '',
            startTime: new Date(),
            endTime: new Date()
          }
        ], // 综合信息
        setype: '分时' // 方案类型
      },
      options: [
        {
          value: '尖',
          label: '尖'
        },
        {
          value: '峰',
          label: '峰'
        },
        {
          value: '平',
          label: '平'
        },
        {
          value: '谷',
          label: '谷'
        }
      ], // 尖峰平谷的选择
      operationType: '', // 操作类型
      categoryOptions: []
    }
  },
  created() {
    this.getList()
    this.listCostType()
  },
  methods: {
    // 设置表格
    tableHeadStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'background:#409EFF;color:#fff;text-align:center'
    },
    // 表格体
    tableRowStyle: function({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 4) {
      //   return 'padding:3px;'
      // }
      return 'text-align:center;padding:3px;'
    },
    // 排序
    sortIndex: function(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },

    /* 增加表单项*/
    addItem() {
      this.complexDataForm.programme.push({
        value1: '',
        value2: '',
        price: ''
      })
    },

    /* 删除表单项*/
    removeItem(index) {
      this.complexDataForm.programme.splice(index, 1)
    },

    // 增加时间段表单
    addTime() {
      this.timeDataForm.programme.push({
        value: '',
        startTime: new Date(),
        endTime: new Date()
      })
    },

    // 删除时间段表单项
    removeTime(index) {
      this.timeDataForm.programme.splice(index, 1)
    },

    // 月结定值方案
    monthBtnClick: function() {
      this.operationType = '固定'
      this.monthDialogVisible = true
    },

    // 单费率方案
    simpleBtnClick: function() {
      this.operationType = '单价'
      this.simpleDialogVisible = true
    },

    // 阶梯费率方案
    complexBtnClick: function() {
      this.operationType = '阶梯'
      this.complexDialogVisible = true
    },

    // 时间费率方案
    timeBtnClick: function() {
      this.operationType = '分时'
      this.timeDialogVisible = true
    },

    // 添加收费方案
    saveCost: function(dataForm) {
      console.log(dataForm)
      for (var key in dataForm) {
        console.log(key)
        if (dataForm[key] === '') {
          this.$message.warning('请填写好信息')
          return
        }
      }
      var tempProgramme = ''
      var programme = dataForm.programme
      if (this.operationType === '阶梯') {
        for (let i = 0; i < programme.length; i++) {
          tempProgramme = `${tempProgramme}${programme[i].value1}-${programme[i].value2} ${programme[i].price}`
          if (i !== programme.length - 1) {
            tempProgramme = tempProgramme + '<br/>'
          }
        }
        dataForm.programme = tempProgramme
      } else if (this.operationType === '分时') {
        tempProgramme = '尖' + this.timeDataForm.price1 + ' ' + '峰' + this.timeDataForm.price2 + '<br/>' +
          '平' + this.timeDataForm.price3 + ' ' + '谷' + this.timeDataForm.price4 + '<br/><br/>'
        for (let i = 0; i < programme.length; i++) {
          tempProgramme = `${tempProgramme}${hourAndMinute(programme[i].startTime)}-${hourAndMinute(programme[i].endTime)} ${programme[i].value}`
          if (i !== programme.length - 1) {
            tempProgramme = tempProgramme + '<br/>'
          }
        }
        dataForm.programme = tempProgramme
      }

      this.loading = true
      this.monthDialogVisible = false
      this.simpleDialogVisible = false
      this.complexDialogVisible = false
      this.timeDialogVisible = false
      saveCost(dataForm).then(result => {
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

    // 删除收费方案
    deleteCost: function(data) {
      this.$confirm('此操作将永久删除该档案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          id: parseInt(data.id)
        }
        this.loading = true
        deleteCost(params).then(result => {
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

    // 查询收费方案
    getList: function() {
      this.message = []
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        schemeName: this.queryName,
        pageIndex: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.loading = true
      getCostPlanCondition(params).then(result => {
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
    },

    // 获取收费方案类型列表
    listCostType: function() {
      var params = {
        communityId: window.sessionStorage.getItem('communityId')
      }
      listCostType(params).then(result => {
        if (result.msg === 'success') {
          this.categoryOptions = result.page
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>

  .assets-container{
    height: 100%;
    padding: 20px;
  }

  .condition{
    display: flex;

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

  .el-input{
    width: 300px;
  }
  .el-select{
    width: 100px;
  }

</style>
