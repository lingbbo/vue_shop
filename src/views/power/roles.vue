<template>
  <el-card>
    <!--    添加角色按钮-->
    <el-row>
      <el-button type="primary">添加角色</el-button>
    </el-row>
    <!--    角色列表-->
    <el-table :data="roleList" border stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row>
            <!--            第一层-->
            <el-row v-for="(item, index) in props.row.children" :key="index" :gutter="0"
                    style="border-bottom: 1px solid #DDFFDD"
                    :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']">
              <el-col :span="5">
                <el-tag closable @close="delTag(props.row.id,item.id)">{{item.authName}}</el-tag>
              </el-col>
              <el-col :span="19">
                <!--                第二层-->
                <el-row v-for="(subItem, subIndex) in item.children" :key="subIndex" :gutter="0"
                        :class="[subIndex === 0 ? '' : 'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="delTag(props.row.id,subItem.id)">{{subItem.authName}}
                    </el-tag>
                  </el-col>
                  <el-col :span="18">
                    <!--                    第三层-->
                    <el-tag
                      v-for="(secItem, secIndex) in subItem.children"
                      :key="secIndex"
                      closable
                      type="warning"
                      @close="delTag(props.row.id,secItem.id)"
                    >{{secItem.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)"></el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRights(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="提示"
      :visible.sync="showRightDialog"
      width="50%"
      :before-close="beforeClose">
      <el-tree
        :props="props"
        :data="rightTree"
        node-key="id"
        :show-checkbox="true"
        ref="elTree"
        :default-expand-all="true">
      </el-tree>

      <span slot="footer" class="dialog-footer">
    <el-button @click="closeDialog">取 消</el-button>
    <el-button type="primary" @click="submitRight()">确 定</el-button>
       </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="addRolesDialog"
      width="50%"
      :before-close="rolesBeforeClose">
      <el-form>
        <el-form-item prop="roleName" v-model="form" ref="form" rule="rules">
          <el-input type="text" v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc">
          <el-input type="text" v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="closeRole">取 消</el-button>
        <el-button type="primary" @click="submitAdd()">确 定</el-button>
       </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'roles',
  data() {
    return {
      roleList: [],
      rightTree: {},
      showRightDialog: false,
      props: {
        id: 'id',
        label: 'authName',
        children: 'children'
      },
      leafKeys: [],
      currentRole: {},
      form: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { type: 'string', required: true, message: '请输入角色名称' }
        ],
        roleDesc: [
          { type: 'string', required: true, message: '请输入角色描述' }
        ]
      },
      addRolesDialog: false
    }
  },
  created() {
    this.qryData()
  },
  methods: {
    async qryData() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.roleList = res.data
    },
    async delTag(roleId, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      const url = 'roles/' + roleId + '/rights/' + rightId
      const { data: res } = await this.$http.delete(url)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.qryData()
    },
    async handleDelete(row) {
      const asyncConfirm = await this.$confirm(
        '此操作将永久删除该用户信息，是否继续！',
        {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      ).catch((e) => e)
      if (asyncConfirm !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      const { data: res } = await this.$http.delete('roles/' + row.id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.qryData()
    },
    async setRights(row) {
      this.currentRole = row
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightTree = res.data
      this.leafkeys = []
      this.getLeafKeys(row, this.leafKeys)

      this.$nextTick(() => {
        // this.$refs.elTree.setCheckedKeys(this.leafKeys)
        this.$refs.elTree.setCheckedNodes(this.leafKeys)
      })
      this.showRightDialog = true
    },
    getLeafKeys(item, nodes) {
      if (!item.children) {
        nodes.push(item)
        return
      }
      item.children.forEach((j) => this.getLeafKeys(j, nodes))
    },
    beforeClose() {
      this.showRightDialog = false
    },
    closeDialog() {
      this.showRightDialog = false
    },
    async submitRight() {
      const params = {
        rids: this.$refs.elTree.getCheckedKeys(true).toString()
      }
      const { data: res } = await this.$http.post('/roles' + this.currentRole.id + 'rights', params)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.qryData()
      this.showRightDialog = false
    },
    rolesBeforeClose() {},
    closeRole() {},
    submitAdd() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        const { res } = await this.$http.post('/roles', this.form)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 5px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
