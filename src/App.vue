<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
  .demo-table-expand {
    font-size: 0;
    display: flex;
    flex-wrap: wrap;
  }

  .demo-table-expand label {
    width: 130px;
    color: #99a9bf;
    margin-left: 40px
  }
  .demo-table-expand .el-form-item {
    margin: 0;
    width: 45%;
    text-align: left;
  }

  .el-table__expanded-cell[class*=cell]{
    padding: 0 50px;
  }

  .el-dialog{
    min-width: 500px!important;
  }
  /*.el-dialog__body{*/
    /*min-height: 500px!important;*/
    /*overflow: auto;*/
  /*}*/
</style>
