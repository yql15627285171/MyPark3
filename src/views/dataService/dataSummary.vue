<template>
  <div class="dataSummaryContainer">
    <el-tabs v-model="activeName">
      <el-tab-pane label="日用电量" name="first">
        <day-data :time="time"/>
      </el-tab-pane>
      <el-tab-pane label="月冻结" name="second">
        <month-data :time="time"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dayData from '@/views/userService/components/dayData'
import monthData from '@/views/userService/components/monthData'
export default {
  name: 'DataSummary',
  components: {
    dayData,
    monthData
  },
  data() {
    return {
      activeName: 'first',
      time: new Date()
    }
  }
}
</script>

<style scoped lang="scss">
  .dataSummaryContainer{
    height: 100%;
    padding: 20px;
  }
</style>
