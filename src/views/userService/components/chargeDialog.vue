<template>
  <el-dialog
    v-loading="loading"
    :visible.sync="dialogVisible"
    :title="dialogTitle"
    width="35%"
    center>
    <el-form label-width="100px">
      <!--<el-form-item label="房间信息">-->
      <!--<el-input :value="houseInfo" disabled/>-->
      <!--</el-form-item>-->
      <el-form-item label="资产信息">
        <el-input :value="assetsInfo" disabled/>
      </el-form-item>
      <el-form-item v-if="dialogTitle == '充值'" label="类型">
        <el-select
          v-model="transaction"
          placeholder="请选择交易类型"
          clearable
          size="medium">
          <el-option
            v-for="(item,index) in TransactionMethod"
            :key="index"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="金额">
        <el-input v-model="money"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelBtnClick">取 消</el-button>
      <el-button type="primary" @click="sureBtnClick">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { recharge } from '@/api/userService'
export default {
  name: 'ChargeDialog',
  props: {
    chargeDialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '充值'
    },
    assetsInfo: {
      type: String,
      default: ''
    },
    houseInfo: {
      type: String,
      default: ''
    },
    assetsCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      money: 0,
      TransactionMethod: [
        {
          label: '现金',
          value: '0'
        },
        {
          label: '微信',
          value: '1'
        },
        {
          label: '支付宝',
          value: '2'
        },
        {
          label: '银联',
          value: '3'
        },
        {
          label: '补助',
          value: '4'
        },
        {
          label: '支票',
          value: '5'
        },
        {
          label: '其他',
          value: '9'
        }], // 交易方式
      transaction: ''
    }
  },
  watch: {
    chargeDialogVisible: function(value) {
      this.dialogVisible = value
    },
    dialogVisible: function(value) {
      this.$emit('update:chargeDialogVisible', value)
    }
  },
  methods: {
    sureBtnClick: function() {
      if (this.money === '' || this.transaction === '') {
        this.$message.warning('请填写完整信息')
        return
      }
      if (parseFloat(this.money) <= 0 || parseFloat(this.money) % 1 !== 0) {
        this.$message.warning('金额必须是大于0的整数')
        return
      }
      this.$confirm(`你确定${this.dialogTitle}${this.money}元吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.dialogTitle === '充值') {
          this.recharge()
        }
      }).catch(() => {
        // 点击取消
      })
    },

    // 点击取消按钮
    cancelBtnClick: function() {
      this.$emit('update:chargeDialogVisible', false)
    },

    // 充值
    recharge: function() {
      this.loading = true
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        assetsCode: this.assetsCode,
        TransactionAmount: this.money,
        TransactionMode: 2,
        TransactionMethod: this.transaction
      }
      recharge(params).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.$alert('操作成功', '提示')
          this.$emit('update:chargeDialogVisible', false)
          this.$parent.getMeterStateList()
        } else {
          alert('充值失败，' + result.msg, '提示')
          // this.$message.error(result.msg)
        }
      }).catch(_ => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .el-input{
    width: 300px;
  }
  .el-select{
    width: 300px;
  }
</style>
