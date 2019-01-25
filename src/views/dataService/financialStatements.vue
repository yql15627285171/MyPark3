<template>
  <div class="financialStatementsContainer">
    <recharge-record :time="time"/>
  </div>
</template>

<script>
import rechargeRecord from '@/views/userService/components/rechargeRecord'
export default {
  name: 'FinancialStatements',
  components: {
    rechargeRecord
  },
  data() {
    return {
      time: new Date()
    }
  }
}
</script>

<style scoped lang="scss">
.financialStatementsContainer{
  height: 100%;
  padding: 20px;
}

</style>
