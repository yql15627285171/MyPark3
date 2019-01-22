<template>
  <div class="financialStatementsContainer">
    <recharge-record/>
  </div>
</template>

<script>
import rechargeRecord from '@/views/userService/components/rechargeRecord'
export default {
  name: 'FinancialStatements',
  components: {
    rechargeRecord
  }
}
</script>

<style scoped lang="scss">
.financialStatementsContainer{
  height: 100%;
  padding: 20px;
}

</style>
