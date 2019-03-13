<!--用电配置-->
<template>
  <div v-loading="loading" class="settingsContainer">
    <div class="item">
      <span>报警金额</span>
      <el-input
        v-model="warningMoney"
        size="medium"/>
    </div>
    <div class="item">
      <span>结算日期</span>
      <el-input
        v-model="settlementDate"
        size="medium"/>
    </div>
    <el-button type="primary" size="medium" @click="uplelp">确定</el-button>
  </div>
</template>

<script>
import { uplelp, getlelp } from '@/api/userService'
export default {
  name: 'Settings',
  data() {
    return {
      loading: false,
      warningMoney: '',
      settlementDate: ''
    }
  },
  mounted() {
    this.getlelp()
  },
  methods: {
    // 设置结算日和报警金额
    uplelp: function() {
      var params = {
        settleDay: this.settlementDate,
        cllp: this.warningMoney,
        id: window.sessionStorage.getItem('communityId')
      }
      this.loading = true
      uplelp(params).then(result => {
        this.loading = false
        if (result.msg === 'success') {
          this.$message.success('设置成功')
        } else {
          this.$message.error(result.msg)
        }
      })
    },

    // 查询结算日和报警金额
    getlelp: function() {
      var params = {
        id: window.sessionStorage.getItem('communityId')
      }
      this.loading = true
      getlelp(params).then(result => {
        this.loading = false
        console.log(result)
        if (result.msg === 'success') {
          if (result.list[0].settleDay === null) {
            this.settlementDate = ''
          } else {
            this.settlementDate = result.list[0].settleDay
          }

          if (result.list[0].cllp === null) {
            this.warningMoney = ''
          } else {
            this.warningMoney = result.list[0].cllp
          }
        } else {
          this.$message.error(result.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.settingsContainer{
  height: 100%;
  padding: 20px;
  text-align: center;
}
  .el-input{
    width: 250px;
    margin-left: 10px;
  }

  .item{
    margin-top: 20px;
  }
  .el-button{
    width: 150px;
    margin-top: 20px;
  }
</style>
