<template>
  <div class="operationRecordContainer">
    <el-tabs v-model="activeName">
      <el-tab-pane label="登录日志" name="first">
        <login-record/>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="second">
        <oprt-record/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import loginRecord from './components/operationRecord/loginRecord'
import oprtRecord from './components/operationRecord/oprtRecord'
export default {
  name: 'OperationRecord',
  components: {
    loginRecord,
    oprtRecord
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.operationRecordContainer{
  height: 100%;
  padding: 20px;
}
</style>
