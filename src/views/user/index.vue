<template>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="query">
            <el-button slot="append" icon="el-icon-search" @click="qryUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="showUserDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width:100%" border>
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column  prop="username" label="姓名" >
        </el-table-column>
        <el-table-column  prop="email" label="邮箱" >
        </el-table-column>
        <el-table-column prop="mobile" label="电话" >
        </el-table-column>
        <el-table-column prop="role_name" label="角色" >
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showUpdateDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteUser(scope.row)"></el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>

      <el-dialog
        title="提示"
        :visible.sync="showAddUser"
        width="50%"
        :before-close="beforeCloseAddUser">
        <el-form :model="addUserForm" status-icon :rules="rules" ref="addUserForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input type="username" v-model="addUserForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addUserForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="closeAddUser">取 消</el-button>
    <el-button type="primary" @click="submitAdd()">确 定</el-button>
  </span>
      </el-dialog>

      <el-dialog
        title="提示"
        :visible.sync="showUpdateUser"
        width="50%"
        :before-close="beforeCloseUpdateUser">
        <el-form :model="updateForm" status-icon :rules="rules" ref="updateForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input type="username" v-model="updateForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="updateForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="updateForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="updateForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="closeUpdateUser">取 消</el-button>
    <el-button type="primary" @click="submitUpdateUser()">确 定</el-button>
  </span>
      </el-dialog>

      <el-dialog
        title="提示"
        :visible.sync="showUpdateRole"
        width="35%"
        :before-close="beforeCloseUpdateRole">
        <el-form :model="updateRoleForm" status-icon  ref="updateRoleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="当前用户" prop="username">
            {{updateRoleForm.username}}
          </el-form-item>
          <el-form-item label="当前角色" prop="password">
            {{updateRoleForm.role_name}}
          </el-form-item>
          <el-form-item label="分配新角色" prop="roleId">
            <el-select v-model="roleId" placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align: center">
    <el-button @click="closeUpdateRole">取 消</el-button>
    <el-button type="primary" @click="submitUpdateRole()">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
</template>

<script>
export default {
  name: 'users',
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

    return {
      query: '',
      userList: [],
      total: 0,
      pagenum: 1,
      pagesize: 10,
      showAddUser: false,
      showUpdateUser: false,
      showUpdateRole: false,
      addUserForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      updateForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      updateRoleForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      rules: {
        username: [
          { type: 'string', required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 16, message: '用户名长度在3到18个字符', trigger: 'blur' }
        ],
        password: [
          { type: 'string', required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'string', required: true, message: '邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { type: 'string', required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      roles: [],
      roleId: ''
    }
  },
  created() {
    this.qryUsers()
  },
  methods: {
    async qryUsers() {
      const url = '/users' + '?pagenum=' + this.pagenum + '&pagesize=' + this.pagesize + '&query=' + this.query
      const { data: res } = await this.$http.get(url)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.userList = res.data.users
        this.total = res.data.total
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.pagenum = 1
      this.qryUsers()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.qryUsers()
    },
    async userStateChanged (row) {
      // /users/556/state/false
      const url = 'users/' + row.id + '/state/' + row.mg_state
      const { data: res } = await this.$http.put(url)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.$message.success('更新用户状态成功！')
    },
    showUserDialog() {
      this.showAddUser = true
    },
    beforeCloseAddUser() {
      this.$refs.addUserForm.resetFields()
      this.showAddUser = false
    },
    closeAddUser() {
      this.showAddUser = false
    },
    submitAdd() {
      this.$refs.addUserForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
          return
        }
        this.$message.success('添加用户成功！')
        this.closeAddUser()
        this.qryUsers()
      })
    },
    showUpdateDialog(row) {
      debugger
      this.updateForm = row
      this.showUpdateUser = true
      this.qryUsers()
    },
    beforeCloseUpdateUser() {
      this.$refs.updateForm.resetFields()
      this.showUpdateUser = false
    },
    closeUpdateUser() {
      this.showUpdateUser = false
    },
    submitUpdateUser() {
      this.$refs.updateForm.validate(async (valid) => {
        if (!valid) return
        const url = 'users/' + this.updateForm.id
        const { data: res } = await this.$http.put(url, this.updateForm)
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
          return
        }
        this.$message.success(res.meta.msg)
        this.closeUpdateUser()
      })
    },
    async handleDeleteUser(row) {
      const url = 'users/' + row.id
      const { data: res } = await this.$http.delete(url)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.$message.success(res.meta.msg)
      this.qryUsers()
    },
    async setRole(row) {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.roles = res.data
      this.updateRoleForm = row
      this.showUpdateRole = true
    },
    beforeCloseUpdateRole() {
      this.$refs.updateRoleForm.resetFields()
      this.roleId = ''
      this.showUpdateRole = false
    },
    closeUpdateRole() {
      this.showUpdateRole = false
    },
    async submitUpdateRole() {
      const url = 'users/' + this.updateRoleForm.id + '/role'
      const { data: res } = await this.$http.put(url, this.updateForm, { roleId: this.roleId })
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.$message.success(res.meta.msg)
      this.closeUpdateRole()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
