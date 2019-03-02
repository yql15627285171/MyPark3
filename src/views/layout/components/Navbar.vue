<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <div class="right-menu">
      <div class="right-menu-item user-name">{{ userName }}</div>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/dashboard">
            <el-dropdown-item>
              主页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="dialogFormVisible = true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" title="修改密码">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="旧密码">
          <el-input v-model="form.password" type="password" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="新密码">
          <el-input v-model="form.newPassword" type="password" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureChangePsd">确 定</el-button>
      </div>
    </el-dialog>

  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updateSysUserPassword } from '@/api/login'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      userName: window.sessionStorage.getItem('communityName'),
      dialogFormVisible: false,
      form: {
        password: '',
        newPassword: ''
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      // this.$router.push('/')
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    sureChangePsd() {
      var params = {
        userId: window.sessionStorage.getItem('userId'),
        password: this.form.password,
        newPassword: this.form.newPassword
      }
      updateSysUserPassword(params).then(result => {
        if (result.msg === 'success') {
          this.$message.success('修改成功')
          this.dialogFormVisible = false
        } else {
          this.$message.error(result.msg)
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  /*.screenfull {*/
    /*position: absolute;*/
    /*right: 90px;*/
    /*top: 16px;*/
    /*color: red;*/
  /*}*/
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }

    .user-name{
      vertical-align: top;
    }

    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .el-input{
    width: 300px;
  }
}

</style>

