<template>
    <div class="login_container">
        <div class="login_box">
            <div class="login_image">
                <img src="@/assets/logo.png" alt="">
            </div>
            <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="0"
                     class="login_form">
                <el-form-item label="" prop="username">
                    <el-input type="text" v-model="loginForm.username" autocomplete="off"
                              prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off"
                              prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
                    <el-button @click="resetForm('loginForm')" type="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [{ type: 'string', required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在6到15位之间', trigger: 'blur' }],
        password: [{ type: 'string', required: true, min: 6, max: 16, message: '请输入正确的用户名', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15位之间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 登录提交
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        // await 简化 返回值是await 对象的操作  await 只能使用在async 修饰的方法中
        // 结构出 data 属性
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          this.$message.success('登陆失败')
        }
        this.$message.success('登陆成功')
        //    1.将登陆成功后的token保存到 sessionStorage中
        //     1.1项目中除了登陆之外的其他API接口，必须在登陆后才能访问
        //     1.2 token只应当在当前网站打开期间生效，所以保存在sessionStorage中，
        localStorage.setItem('token', res.data.token)
        //     2.通过编程时导航跳转到后台主页，路由地址是/home
        this.$router.push('/welcome')
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        width: 100%;
        height: 100vh;
        border: 1px solid #2b4b6b;
    }

    .login_box {
        position: relative;
        width: 450px;
        height: 300px;
        margin: 200px auto;
        background-color: #fff;
    }

    .login_image {
        position: absolute;
        left: 50%;
        top: -50%;
        width: 130px;
        height: 130px;
        padding: 10px;
        border-radius: 50%;
        background-color: #fff;
        transform: translate(-50%, 50%);

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }

    .login_form {
        padding: 100px 20px;
    }

</style>
