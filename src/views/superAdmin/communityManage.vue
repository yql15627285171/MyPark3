<template>
  <div class="communityManageContainer">
    <div class="condition">
      <el-input
        v-model.trim="queryName"
        placeholder="请输入社区名"
        prefix-icon="el-icon-search"
        size="medium"/>
      <el-button type="primary" size="medium" @click="getCommunityList">查询</el-button>
      <el-button type="primary" size="medium" @click="showAddDialog">新增</el-button>
    </div>

    <div class="tableMessage">
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
          prop="communityName"
          label="社区名"/>
        <el-table-column
          prop="province"
          label="省"/>
        <el-table-column
          prop="city"
          label="市"/>
        <el-table-column
          prop="district"
          label="区"/>
        <el-table-column
          prop="settleDay"
          label="结算日"/>
        <el-table-column
          label="操作">
          <template slot-scope="scope" >

            <el-button
              type="text"
              size="small"
              style="color: #55a532"
              @click="showDialog(scope.row)">
              <i class="el-icon-edit"/>
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              style="color: #df5000"
              @click="deleteCommunityInfo(scope.row)">
              <i class="el-icon-delete"/>
              删除
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="el-pagination">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getCommunityList" />
    </div>
    <!--弹框显示新增操作-->
    <el-dialog :visible.sync="dialogFormVisible" title="增加社区">
      <el-form label-width="100px">
        <el-form-item label="省">
          <el-select v-model="province" placeholder="请选择" size="medium">
            <el-option
              v-for="item in provinces"
              :key="item.id"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="市">
          <el-select v-model="city" placeholder="请选择" size="medium">
            <el-option
              v-for="item in citys"
              :key="item.id"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="区">
          <el-select v-model="district" placeholder="请选择" size="medium">
            <el-option
              v-for="item in districts"
              :key="item.id"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="社区">
          <el-input v-model.trim="communityName" size="medium" placeholder="请输入社区名字"/>
        </el-form-item>
        <el-form-item label="结算日">
          <el-input v-model.trim="settleDay" size="medium" placeholder="请输入1到28的数字"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import area from '@/area'
import {
  saveCommunityInfo,
  getCommunityList,
  updateCommunityInfo,
  deleteCommunityInfo } from '@/api/superAdmin'
export default {
  name: 'CommunityManage',
  components: { Pagination },
  data() {
    return {
      queryName: '',
      message: [],
      loading: false,
      dialogFormVisible: false, // 是否弹框
      province: '', // 选择的省份
      city: '',
      district: '',
      communityName: '',
      id: '', // 修改社区的id
      settleDay: '', // 结算日
      provinces: [], // 省份数据源
      citys: [],
      districts: [],
      operationType: 'add', // 是添加还是修改的操作
      total: 0, // 表格数据的总数
      listQuery: {
        page: 1,
        limit: 20
      } // 二次封装的分页器数据
    }
  },
  watch: {
    province: function(newValue) {
      if (newValue === '') {
        this.city = ''
        this.district = ''
        this.citys = []
        this.districts = []
        return
      }

      if (newValue === '北京' || newValue === '上海' ||
        newValue === '天津' || newValue === '重庆') {
        this.city = newValue
        this.citys = []
      } else {
        this.city = ''
        var node = area.find(element => {
          return element.name === newValue
        })

        if (undefined !== typeof (node)) {
          this.citys = area.filter(element => {
            return element.parentid === node.id
          })
        }
      }
    },
    city: function(newValue) {
      this.district = ''

      if (newValue === '') {
        return
      }

      var node = area.find(element => {
        return element.name === newValue
      })

      if (undefined !== typeof (node)) {
        this.districts = area.filter(element => {
          return element.parentid === node.id
        })
      }
    }
  },
  created() {
    this.provinces = area.filter(function(element) {
      return element.depth === '1'
    })

    //  获取社区列表
    this.getCommunityList()
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
      return 'text-align:center;padding:2px;'
    },

    /**
     * 点击修改，弹出框
     */
    showDialog: function(data) {
      this.dialogFormVisible = true
      this.operationType = 'update'
      this.province = data.province
      // 因为省市区的修改，会在watch中清空子区域，所以要稍稍延时赋值
      setTimeout(_ => {
        this.city = data.city
      }, 10)
      setTimeout(_ => {
        this.district = data.district
      }, 20)

      this.communityName = data.communityName
      this.settleDay = data.settleDay
      this.id = data.id
    },

    /**
     * 点击添加，弹出框
     */
    showAddDialog: function() {
      this.dialogFormVisible = true
      this.operationType = 'add'
      this.province = ''
      this.city = ''
      this.district = ''
      this.communityName = ''
      this.settleDay = ''
      this.id = ''
    },

    /**
     * 点击确认，进行修改还是添加
     */
    sureAddOrUpdate: function() {
      if (this.province === '' || this.city === '' ||
        this.district === '' || this.communityName === '') {
        this.$message.warning('请填写好资料')
      } else {
        var arCode = area.find(element => {
          return element.name === this.district
        }).id
        var params = {
          arCode: arCode,
          province: this.province,
          city: this.city,
          district: this.district,
          communityName: this.communityName,
          settleDay: this.settleDay,
          id: this.id
        }
        this.dialogFormVisible = false
        if (this.operationType === 'add') {
          this.saveCommunityInfo(params)
        } else {
          this.updateCommunityInfo(params)
        }
      }
    },

    /**
     *获取所有社区
     * comm_name 模糊查询的条件 值为空的时候是查询所有
     */
    getCommunityList: function() {
      var params = {
        comm_name: this.queryName,
        pageIndex: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      this.loading = true
      getCommunityList(params).then(result => {
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

    // 添加社区
    saveCommunityInfo: function(params) {
      this.loading = true
      saveCommunityInfo(params).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.$message.success('添加成功')
          this.getCommunityList()
        } else {
          this.$message.error(result.msg)
        }
      }).catch(_ => {
        this.loading = false
      })
    },

    // 更新社区
    updateCommunityInfo: function(params) {
      this.loading = true
      updateCommunityInfo(params).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.$message.success('修改成功')
          this.getCommunityList()
        } else {
          this.$message.error(result.msg)
        }
      }).catch(_ => {
        this.loading = false
      })
    },

    /**
     * 删除社区
     */
    deleteCommunityInfo: function(data) {
      this.$confirm('此操作将永久社区, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定
        var params = {
          ids: data.id
        }
        this.loading = true
        deleteCommunityInfo(params).then(result => {
          this.loading = false
          if (result.msg === 'success') {
            this.$message.success('删除成功')
            this.getCommunityList()
          } else {
            this.$message.error(result.msg)
          }
        }).catch(_ => {
          this.loading = false
        })
      }).catch(() => {
        // 点击取消
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .communityManageContainer {
    height: 100%;
    padding: 20px;
  }

  .condition {
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
    width: 250px;
  }
</style>
