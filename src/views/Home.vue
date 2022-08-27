<template>
  <el-container>
<!--    头部区-->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logOut" class="logOut">退出</el-button>
    </el-header>
<!--    页面主体区-->
    <el-container>
<!--      右侧菜单栏-->
      <el-aside
        :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          text-color="#fff"
          active-text-color="#66CCFF"
          background-color="#373D41"
          router
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false">
<!--          一级菜单-->
          <el-submenu  v-for="(item, index) in menuLists" :index = "index+''" :key="index">
<!--            一级菜单模板区-->
            <template slot="title"><i :class="iconsObj[parseInt(item.id)]"></i>
              <span slot="title">{{item.authName}}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item  v-for="(subItem,subIndex) in item.children" :index="'/'+subItem.path" :key="subIndex">
              <i class="el-icon-s-operation"></i>{{subItem.authName}}
            </el-menu-item>
<!--            <el-menu-item index="1-2"><i class="el-icon-message"></i>选项2</el-menu-item>-->
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      主要内容-->
      <el-main>
<!--        面包屑导航-->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>模块</el-breadcrumb-item>
          <el-breadcrumb-item>功能</el-breadcrumb-item>
        </el-breadcrumb>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      activePath: '',
      menuLists: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created () {
    this.getMenus()
  },
  watch: {

  },
  methods: {
    logOut() {
      localStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单
    async getMenus() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.menuLists = res.data
      this.$message.success('获取菜单成功！')
    },
    // 控制菜单折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 菜单点击事件
    selectMenus (index, path) {
      debugger
    }
  }
}
</script>

<style lang="less" scoped>
  .el-container{
    height: 100%;
    border: 0px solid #eee;
  }
  .el-header{
    /*flex布局*/
    display: flex;
    background-color: #373D41;
    color: #333;
    line-height: 60px;
  /*  贴两边对齐*/
    justify-content: space-between;
  /* 水平居中 不上下贴边*/
    align-items: center;
    > div {
      display: flex;
      align-items: center;
      >span{
        color: #ffffff;
        margin-left: 20px;
      }
    }
  }

  .el-aside {
    background-color: #373D41;
    color: #333;
    /*min-height:90vh;*/
  }
.el-aside .el-menu{
  border: none;
}
  .el-main {
    background-color: #E9EEF3;
    color: #333;
   /*min-height:85vh;*/
  }

  body > .el-container {
    margin-bottom: 40px;
  }
  /*.logOut{*/
  /*  float: right;*/
  /*  margin-right: 30px;*/
  /*  margin-top:10px;*/
  /*}*/
  .toggle-button{
    background-color: #999;
    color: #fff;
    line-height: 24px;
    font-size: 10px;
    text-align: center;
    letter-spacing: .2em;
    cursor: pointer;
  }
  .iconfont{
    margin-right: 15px;
  }
  .el-breadcrumb{

  }
</style>
